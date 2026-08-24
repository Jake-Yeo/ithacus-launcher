export function styleFloatingBackButton(button: HTMLButtonElement, desktop: boolean) {
  button.style.cssText = ['position:fixed', 'z-index:2147483646', 'right:18px', desktop ? 'top:18px' : 'bottom:calc(16px + env(safe-area-inset-bottom))', 'display:flex', 'align-items:center', 'gap:7px', 'min-height:44px', 'padding:10px 14px', 'border:1px solid #c9dfe0', 'border-radius:999px', 'background:#fff', 'color:#356b72', 'box-shadow:0 8px 28px rgba(35,25,28,.18)', 'font:800 12px -apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif', 'cursor:pointer', '-webkit-tap-highlight-color:transparent'].join(';')
  button.querySelector('svg')?.setAttribute('style', 'width:21px;height:21px;fill:none;stroke:currentColor;stroke-width:2;stroke-linecap:round;stroke-linejoin:round')
  button.querySelector('span')?.setAttribute('style', 'font-size:12px;font-weight:800')
}
