"""Run an actual Chromium smoke test against the checked-in simulator page.

The standalone page contains the real markup, CSS, and JavaScript used by Jekyll.
No mock DOM is used; browser errors fail the test.
"""
from pathlib import Path
from playwright.sync_api import sync_playwright

source = Path("_pages/my-first-qubit.html").read_text(encoding="utf-8")
if source.startswith("---"):
    source = source.split("---", 2)[-1]
html = "<!DOCTYPE html><html><head><meta charset='utf-8'></head><body>" + source + "</body></html>"
out = Path("/tmp/qubit-browser-test.html")
out.write_text(html, encoding="utf-8")
built = Path("_site/learn/my-first-qubit/index.html")
assert built.is_file(), "Expected GitHub Pages Jekyll output is missing"
out = built.resolve()


with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page(viewport={"width": 1280, "height": 900}, reduced_motion="no-preference")
    errors = []
    page.on("pageerror", lambda e: errors.append(str(e)))
    page.goto(out.as_uri())
    page.wait_for_selector("#mfq-circle0")
    page.wait_for_timeout(80)
    assert page.locator("#mfq-p0").inner_text() == "100%"
    assert page.locator("#mfq-p1").inner_text() == "0%"

    def press(gate):
        button = page.locator(f'[data-gate="{gate}"]')
        button.click()
        page.wait_for_function("!document.querySelector('[data-gate=\"X\"]').disabled", timeout=5000)

    # X from a pole: watch the state grow, not just the final result.
    page.locator('[data-gate="X"]').click()
    page.wait_for_timeout(100)
    p1_during = page.locator("#mfq-p1").inner_text()
    assert p1_during != "0%", "X animation did not start"
    page.wait_for_function("!document.querySelector('[data-gate=\"X\"]').disabled", timeout=5000)
    assert page.locator("#mfq-p1").inner_text() == "100%"

    page.locator("#mfq-reset").click()
    page.wait_for_function("!document.querySelector('#mfq-reset').disabled", timeout=5000)
    assert page.locator("#mfq-p0").inner_text() == "100%"

    press("H")
    assert page.locator("#mfq-p1").inner_text() == "50%"
    press("Z")
    assert page.locator("#mfq-p1").inner_text() == "50%"
    assert page.locator("#mfq-phi").inner_text() == "180°"
    press("H")
    assert page.locator("#mfq-p1").inner_text() == "100%"

    page.locator("#mfq-measure").click()
    page.wait_for_function("!document.querySelector('#mfq-measure').disabled", timeout=5000)
    assert "Measured 1" in page.locator("#mfq-info").inner_text()

    page.locator("#mfq-reset").click()
    page.wait_for_function("!document.querySelector('#mfq-reset').disabled", timeout=5000)
    page.locator("#mfq-balance").evaluate("""el => {
       el.value = "90";
       el.dispatchEvent(new Event("input", {bubbles:true}));
       el.dispatchEvent(new Event("change", {bubbles:true}));
    }""")
    assert page.locator("#mfq-p1").inner_text() == "50%"
    page.locator("#mfq-phase").evaluate("""el => {
       el.value = "90";
       el.dispatchEvent(new Event("input", {bubbles:true}));
       el.dispatchEvent(new Event("change", {bubbles:true}));
    }""")
    assert page.locator("#mfq-phi").inner_text() == "90°"
    for gate in ["X", "Y", "Z", "H"]:
        press(gate)
    assert all(not page.locator(selector).is_disabled() for selector in
               ["#mfq-measure", "#mfq-reset", "#mfq-phase", "#mfq-balance"])
    assert not errors, "JavaScript browser errors: " + repr(errors)
    print("PASS: Chromium X/H/Z/Y, measurement, reset, sliders, transitions, and no page errors")
    # Phone-sized browser: all interactive controls must remain usable.
    phone = browser.new_page(viewport={"width": 390, "height": 844})
    phone_errors = []
    phone.on("pageerror", lambda e: phone_errors.append(str(e)))
    phone.goto(out.as_uri())
    phone.locator('[data-gate="H"]').click()
    phone.wait_for_function("!document.querySelector('[data-gate=\\\"H\\\"]').disabled", timeout=5000)
    assert phone.locator("#mfq-p1").inner_text() == "50%"
    phone.locator("#mfq-reset").click()
    phone.wait_for_function("!document.querySelector('#mfq-reset').disabled", timeout=5000)
    assert not phone_errors, repr(phone_errors)
    phone.close()

    # Reduced-motion preference must produce an immediate valid result.
    accessible = browser.new_page(reduced_motion="reduce")
    accessible.goto(out.as_uri())
    accessible.locator('[data-gate="X"]').click()
    assert accessible.locator("#mfq-p1").inner_text() == "100%"
    assert accessible.locator("#mfq-measure").is_enabled()
    accessible.close()
    print("PASS: phone viewport and reduced-motion browser checks")
    browser.close()
