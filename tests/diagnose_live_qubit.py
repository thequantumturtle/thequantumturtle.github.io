from playwright.sync_api import sync_playwright
import json
URL="https://thequantumturtle.github.io/learn/my-first-qubit/"
with sync_playwright() as p:
    browser=p.chromium.launch(headless=True)
    page=browser.new_page()
    errors=[]
    page.on("pageerror",lambda err: errors.append(str(err)))
    page.goto(URL,wait_until="domcontentloaded")
    page.wait_for_timeout(1000)
    def snap(label):
        print(label,json.dumps({
            "p0":page.locator("#mfq-p0").inner_text(),
            "p1":page.locator("#mfq-p1").inner_text(),
            "slider":page.locator("#mfq-balance").input_value(),
            "disabled":page.locator('[data-gate="X"]').is_disabled(),
            "errors":errors
        }))
    snap("initial")
    page.locator('[data-gate="H"]').click()
    page.wait_for_timeout(1000)
    snap("after H")
    page.locator("#mfq-balance").fill("90")
    snap("after slider")
    assert page.locator("#mfq-p1").inner_text() == "50%", "LIVE page failed interaction"
    assert not errors, repr(errors)
    browser.close()
