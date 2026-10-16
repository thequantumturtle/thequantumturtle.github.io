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
    assert page.locator("#mfq-phi").inner_text() == "Undefined"

    def press(gate):
        button = page.locator(f'[data-gate="{gate}"]')
        button.click()
        page.wait_for_function("!document.querySelector('[data-gate=\"X\"]').disabled", timeout=5000)

    # X from a pole: watch the state grow, not just the final result.
    page.locator('[data-gate="X"]').click()
    page.wait_for_function("document.getElementById('mfq-p1').textContent !== '0%'", timeout=1500)
    p1_during = page.locator("#mfq-p1").inner_text()
    print("DEBUG", {"p1": p1_during, "errors": errors,
        "status": page.locator("#mfq-info").inner_text(),
        "script_count": page.locator("script").count(),
        "initial_state": page.locator("#mfq-equation").text_content(),
        "is_disabled": page.locator('[data-gate="X"]').is_disabled()}, flush=True)
    if errors:
        scripts = page.locator("script").all_text_contents()
        relevant = [script for script in scripts if "my-first-qubit" in script or "Privacy-conscious" in script]
        print("BUILT_SCRIPT_DEBUG", [
            {"length": len(script), "start": script[:180], "end": script[-350:]}
            for script in relevant
        ], flush=True)
    assert p1_during != "0%", "X animation did not start"
    page.wait_for_function("!document.querySelector('[data-gate=\"X\"]').disabled", timeout=5000)
    assert page.locator("#mfq-p1").inner_text() == "100%"
    assert page.locator("#mfq-phi").inner_text() == "Undefined"
    # The completed X operator must produce +|1>, not -i|1>.
    print("X_STATE_EQUATION", repr(page.locator("#mfq-equation").text_content()), flush=True)
    assert "(1.00 + 0.00i)|1⟩" in page.locator("#mfq-equation").text_content()
    assert page.locator("#mfq-hand0").evaluate("el => el.style.visibility") == "hidden"
    assert page.locator("#mfq-hand1").evaluate("el => el.style.visibility") == "visible"

    page.locator("#mfq-reset").click()
    page.wait_for_function("!document.querySelector('#mfq-reset').disabled", timeout=5000)
    assert page.locator("#mfq-p0").inner_text() == "100%"

    press("H")
    assert page.locator("#mfq-p1").inner_text() == "50%"
    # H|0> is exactly |+>, with no artificial global phase.
    assert "(0.71 + 0.00i)|0⟩" in page.locator("#mfq-equation").text_content()
    assert "(0.71 + 0.00i)|1⟩" in page.locator("#mfq-equation").text_content()
    assert page.locator("#mfq-phi").inner_text() == "0°"
    press("Z")
    assert page.locator("#mfq-p1").inner_text() == "50%"
    assert page.locator("#mfq-phi").inner_text() == "180°"
    press("H")
    assert page.locator("#mfq-p1").inner_text() == "100%"
    assert page.locator("#mfq-phi").inner_text() == "Undefined"

    page.locator("#mfq-measure").click()
    page.wait_for_function("!document.querySelector('#mfq-measure').disabled", timeout=5000)
    assert "Measured 1" in page.locator("#mfq-info").inner_text()

    page.locator("#mfq-reset").click()
    page.wait_for_function("!document.querySelector('#mfq-reset').disabled", timeout=5000)
    assert page.locator("#mfq-phi").inner_text() == "Undefined"
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
    # Exact operator identities, including global phase.
    page.locator("#mfq-reset").click()
    page.wait_for_function("!document.querySelector('#mfq-reset').disabled", timeout=5000)
    press("H")
    press("H")
    assert page.locator("#mfq-equation").text_content() == "|ψ⟩ = (1.00 + 0.00i)|0⟩ + (0.00 + 0.00i)|1⟩"
    assert page.locator("#mfq-phi").inner_text() == "Undefined"
    press("X")
    press("X")
    assert page.locator("#mfq-equation").text_content() == "|ψ⟩ = (1.00 + 0.00i)|0⟩ + (0.00 + 0.00i)|1⟩"
    press("H")
    press("X")
    assert page.locator("#mfq-equation").text_content() == "|ψ⟩ = (0.71 + 0.00i)|0⟩ + (0.71 + 0.00i)|1⟩"
    assert page.locator("#mfq-phi").inner_text() == "0°"
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
