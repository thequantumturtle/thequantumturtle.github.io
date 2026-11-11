"""Chromium regression checks for the standalone Quantum Gate Quest page."""
from pathlib import Path
from playwright.sync_api import sync_playwright

built = Path("_site/learn/quantum-gate-quest/index.html")
assert built.is_file(), "Jekyll output missing: Quantum Gate Quest"
with sync_playwright() as pw:
    browser = pw.chromium.launch(headless=True)
    page = browser.new_page(viewport={"width": 1280, "height": 900})
    errors = []
    page.on("pageerror", lambda e: errors.append(str(e)))
    page.goto(built.resolve().as_uri())
    assert page.locator("#qgq-progress").inner_text() == "Challenge 1 of 6"
    assert "100%" in page.locator("#qgq-current").inner_text()
    assert page.locator("#qgq-next").is_disabled()
    page.locator('[data-gate="X"]').click()
    page.locator("#qgq-check").click()
    assert "Correct!" in page.locator("#qgq-status").inner_text()
    page.locator("#qgq-next").click()
    assert page.locator("#qgq-progress").inner_text() == "Challenge 2 of 6"
    page.locator('[data-gate="H"]').click()
    assert "50%" in page.locator("#qgq-current").inner_text()
    page.locator("#qgq-check").click()
    assert "Correct!" in page.locator("#qgq-status").inner_text()
    page.locator("#qgq-next").click()
    page.locator('[data-gate="H"]').click()
    page.locator("#qgq-check").click()
    assert "Not quite" in page.locator("#qgq-status").inner_text(), "Relative phase must matter"
    page.locator('[data-gate="Z"]').click()
    page.locator("#qgq-check").click()
    assert "Correct!" in page.locator("#qgq-status").inner_text()
    page.locator("#qgq-next").click()
    page.locator('[data-gate="H"]').click()
    page.locator('[data-gate="H"]').click()
    page.locator("#qgq-check").click()
    assert "Correct!" in page.locator("#qgq-status").inner_text()
    page.locator("#qgq-next").click()
    for gate in ["H", "Z", "H"]:
        page.locator(f'[data-gate="{gate}"]').click()
    page.locator("#qgq-check").click()
    assert "Correct!" in page.locator("#qgq-status").inner_text()
    page.locator("#qgq-next").click()
    for gate in ["H", "Z"]:
        page.locator(f'[data-gate="{gate}"]').click()
    page.locator("#qgq-check").click()
    assert "Correct!" in page.locator("#qgq-status").inner_text()
    page.locator("#qgq-next").click()
    assert page.locator("#qgq-progress").inner_text() == "Challenge 1 of 6"
    page.locator("#qgq-reset").click()
    assert page.locator("#qgq-current-label").inner_text() == "0 gates applied"
    assert not errors, repr(errors)

    phone = browser.new_page(viewport={"width": 390, "height": 844})
    phone_errors = []
    phone.on("pageerror", lambda e: phone_errors.append(str(e)))
    phone.goto(built.resolve().as_uri())
    phone.locator('[data-gate="X"]').click()
    phone.locator("#qgq-check").click()
    assert "Correct!" in phone.locator("#qgq-status").inner_text()
    assert not phone_errors, repr(phone_errors)
    browser.close()
    print("PASS: Gate Quest six missions, phase sensitivity, reset, mobile, no JS exceptions")
