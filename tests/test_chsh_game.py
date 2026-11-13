"""CHSH game smoke tests against the Jekyll-built page, using a real browser."""
from pathlib import Path
from playwright.sync_api import sync_playwright

page_path = Path("_site/learn/chsh-game/index.html")
assert page_path.is_file(), "Jekyll CHSH page not generated"

with sync_playwright() as pw:
    browser = pw.chromium.launch(headless=True)
    page = browser.new_page(viewport={"width": 1280, "height": 900})
    errors = []
    page.on("pageerror", lambda err: errors.append(str(err)))
    page.goto(page_path.resolve().as_uri())
    assert page.locator("#chsh-expected").text_content() == "75.00%"
    assert page.locator("#chsh-bound").text_content() == "75.00%"
    assert page.locator("#chsh-count").text_content() == "0 rounds"
    assert page.locator("#chsh .chsh-players").count() == 1
    assert page.locator("#chsh-score-round").inner_text() == "0 / 25"
    assert page.locator("#chsh-reveal").is_hidden()
    assert page.locator("#chsh-lab").is_visible()
    assert not errors, repr(errors)

    # Deterministic classical strategy: zero output loses only on x=y=1.
    # Predetermine the two question bits for a single round.
    page.evaluate("Math.random = () => 0.99")
    page.locator("#chsh-round").click()
    assert page.locator("#chsh-x").inner_text() == "1"
    assert page.locator("#chsh-y").inner_text() == "1"
    assert page.locator("#chsh-a").inner_text() == "0"
    assert page.locator("#chsh-b").inner_text() == "0"
    assert "LOSS" in page.locator("#chsh-status").inner_text()
    assert page.locator("#chsh-actual").text_content() == "0.00%"

    page.locator("#chsh-ca0").click()
    assert page.locator("#chsh-count").text_content() == "0 rounds"
    assert page.locator("#chsh-expected").text_content() == "25.00%"
    page.locator("#chsh-ca0").click()
    assert page.locator("#chsh-expected").text_content() == "75.00%"

    # Quantum optimal settings: Tsirelson bound; outcomes are sampled.
    page.locator('[data-mode="quantum"]').click()
    assert page.locator("#chsh-expected").text_content() == "85.36%"
    assert page.locator("#chsh-bound").text_content() == "85.36%"
    assert page.locator("#chsh-qa1").input_value() == "45"
    page.evaluate("""() => {
        let seed = 123456789;
        Math.random = () => {
            seed = (1664525 * seed + 1013904223) >>> 0;
            return seed / 4294967296;
        };
    }""")
    page.locator("#chsh-lab summary").first.click()
    page.locator("#chsh-batch").click()
    assert page.locator("#chsh-count").text_content() == "1,000 rounds"
    actual = float(page.locator("#chsh-actual").text_content().strip("%"))
    assert 78 < actual < 92, f"Quantum sampling unexpected: {actual}"
    assert page.locator("#chsh-pairs tr").count() == 4

    # Changing quantum measurements clears results, and prediction follows angles.
    page.locator("#chsh-qa1").fill("0")
    assert page.locator("#chsh-count").text_content() == "0 rounds"
    assert page.locator("#chsh-expected").text_content() != "85.36%"
    page.locator("#chsh-optimal").click()
    assert page.locator("#chsh-expected").text_content() == "85.36%"

    # Challenge mode hides optimal button, starts with no quantum advantage.
    page.locator('[data-mode="challenge"]').click()
    assert page.locator("#chsh-optimal").is_hidden()
    assert page.locator("#chsh-expected").text_content() == "75.00%"
    for k, val in [("a1", "45"), ("b0", "22.5"), ("b1", "-22.5")]:
        page.locator("#chsh-q"+k).fill(val)
    assert page.locator("#chsh-expected").text_content() == "85.36%"
    assert page.locator("#chsh-count").text_content() == "0 rounds"
    assert not errors, repr(errors)

    # Iteration 2: all 16 classical deterministic assignments satisfy exactly 1 or 3 pairs.
    page.locator('[data-mode="classical"]').click()
    for mask in range(16):
        for index, key in enumerate(("a0", "a1", "b0", "b1")):
            expected_bit = (mask >> index) & 1
            button = page.locator("#chsh-c"+key)
            if int(button.inner_text()) != expected_bit:
                button.click()
        expected = float(page.locator("#chsh-expected").text_content().strip("%"))
        assert expected in (25.0, 75.0), (mask, expected)
        assert page.locator(".chsh-puzzle-cell[data-satisfied='true']").count() == int(expected / 25)

    # Match is locked after commitment and advances one round per click.
    page.locator("#chsh-reset").click()
    page.locator("#chsh-match-length").select_option("10")
    page.locator("#chsh-match-start").click()
    assert page.locator("#chsh-setup").is_hidden()
    assert page.locator("#chsh-ca0").is_disabled()
    assert page.locator('[data-mode="quantum"]').is_disabled()
    assert page.locator("#chsh-match-length").is_disabled()
    assert page.locator("#chsh-batch").is_disabled()
    for round_number in range(1, 11):
        page.locator("#chsh-round").click()
        assert page.locator("#chsh-count").text_content() == f"{round_number} round" + ("" if round_number == 1 else "s")
    assert "MATCH COMPLETE" in page.locator("#chsh-status").inner_text()
    assert page.locator("#chsh-reveal").is_visible()
    assert page.locator("#chsh-reveal").get_attribute("open") is not None
    assert page.locator("#chsh-score-round").inner_text() == "10 / 10"
    assert page.locator("#chsh-setup").is_visible()
    assert page.locator("#chsh-round").is_disabled()
    assert page.locator("#chsh-ca0").is_enabled()
    page.locator("#chsh-reset").click()
    assert page.locator("#chsh-reveal").is_hidden()
    assert page.locator("#chsh-round").is_enabled()
    assert page.locator("#chsh-match-start").is_enabled()
    assert page.locator("#chsh-count").text_content() == "0 rounds"

    # Quantum match locks measurement sliders and preserves theoretical prediction.
    page.locator('[data-mode="quantum"]').click()
    page.locator("#chsh-match-length").select_option("10")
    page.locator("#chsh-match-start").click()
    assert page.locator("#chsh-qa1").is_disabled()
    assert page.locator("#chsh-expected").text_content() == "85.36%"
    page.locator("#chsh-reset").click()
    assert page.locator("#chsh-qa1").is_enabled()
    assert not errors, repr(errors)

    phone = browser.new_page(viewport={"width": 390, "height": 844})
    phone_errors = []
    phone.on("pageerror", lambda e: phone_errors.append(str(e)))
    phone.goto(page_path.resolve().as_uri())
    phone.locator('[data-mode="quantum"]').click()
    phone.locator("#chsh-round").click()
    assert phone.locator("#chsh-count").text_content() == "1 round"
    assert phone.locator("#chsh-score-wins").is_visible()
    assert phone.locator("#chsh-players").count() == 0  # class-based player grid
    assert phone.locator(".chsh-players").is_visible()
    assert not phone_errors, repr(phone_errors)
    browser.close()
    print("PASS CHSH: classical logic, quantum bound and sampling, angle inputs, challenge and mobile")
