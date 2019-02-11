function errorShakeEffect (DOMNode) {
  DOMNode.classList.add('error-shake');
  setTimeout(e => DOMNode.classList.remove('error-shake'), 500);
}

export {
  errorShakeEffect
};
