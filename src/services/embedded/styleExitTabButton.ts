export function styleExitTabButton(button: HTMLButtonElement) {
  button.style.cssText = ['min-width:0', 'min-height:44px', 'display:flex', 'flex-direction:column', 'align-items:center', 'justify-content:center', 'gap:4px', 'border:0', 'background:transparent', 'color:#a34f54', 'font:inherit', 'cursor:pointer', '-webkit-tap-highlight-color:transparent'].join(';')
  button.querySelector('svg')?.setAttribute('style', 'width:21px;height:21px;fill:none;stroke:currentColor;stroke-width:2;stroke-linecap:round;stroke-linejoin:round')
  button.querySelector('span')?.setAttribute('style', 'font-size:10px;font-weight:750')
}
