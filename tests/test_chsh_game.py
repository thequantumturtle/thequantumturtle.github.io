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
    assert page.locator("#chsh-expected").inner_text() == "75.00%"
    assert page.locator("#chsh-bound").inner_text() == "75.00%"
    assert page.locator("#chsh-count").inner_text() == "0 rounds"
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
    assert page.locator("#chsh-actual").inner_text() == "0.00%"

    page.locator("#chsh-ca0").click()
    assert page.locator("#chsh-count").inner_text() == "0 rounds"
    assert page.locator("#chsh-expected").inner_text() == "25.00%"
    page.locator("#chsh-ca0").click()
    assert page.locator("#chsh-expected").inner_text() == "75.00%"

    # Quantum optimal settings: Tsirelson bound; outcomes are sampled.
    page.locator('[data-mode="quantum"]').click()
    assert page.locator("#chsh-expected").inner_text() == "85.36%"
    assert page.locator("#chsh-bound").inner_text() == "85.36%"
    assert page.locator("#chsh-qa1").input_value() == "45"
    page.evaluate("""() => {
        let seed = 123456789;
        Math.random = () => {
            seed = (1664525 * seed + 1013904223) >>> 0;
            return seed / 4294967296;
        };
    }""")
    page.locator("#chsh-batch").click()
    assert page.locator("#chsh-count").inner_text() == "1,000 rounds"
    actual = float(page.locator("#chsh-actual").inner_text().strip("%"))
    assert 78 < actual < 92, f"Quantum sampling unexpected: {actual}"
    assert page.locator("#chsh-pairs tr").count() == 4

    # Changing quantum measurements clears results, and prediction follows angles.
    page.locator("#chsh-qa1").fill("0")
    assert page.locator("#chsh-count").inner_text() == "0 rounds"
    assert page.locator("#chsh-expected").inner_text() != "85.36%"
    page.locator("#chsh-optimal").click()
    assert page.locator("#chsh-expected").inner_text() == "85.36%"

    # Challenge mode hides optimal button, starts with no quantum advantage.
    page.locator('[data-mode="challenge"]').click()
    assert page.locator("#chsh-optimal").is_hidden()
    assert page.locator("#chsh-expected").inner_text() == "75.00%"
    for k, val in [("a1", "45"), ("b0", "22.5"), ("b1", "-22.5")]:
        page.locator("#chsh-q"+k).fill(val)
    assert page.locator("#chsh-expected").inner_text() == "85.36%"
    assert page.locator("#chsh-count").inner_text() == "0 rounds"
    assert not errors, repr(errors)

    phone = browser.new_page(viewport={"width": 390, "height": 844})
    phone_errors = []
    phone.on("pageerror", lambda e: phone_errors.append(str(e)))
    phone.goto(page_path.resolve().as_uri())
    phone.locator('[data-mode="quantum"]').click()
    phone.locator("#chsh-round").click()
    assert phone.locator("#chsh-count").inner_text() == "1 round"
    assert not phone_errors, repr(phone_errors)
    browser.close()
    print("PASS CHSH: classical logic, quantum bound and sampling, angle inputs, challenge and mobile")
