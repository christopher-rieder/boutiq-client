import PromptBoxes from 'prompt-boxes';

export default new PromptBoxes({
  attrPrefix: 'pb',
  speeds: {
    backdrop: 500, // The enter/leaving animation speed of the backdrop
    toasts: 500 // The enter/leaving animation speed of the toast
  },
  alert: {
    okText: 'Ok', // The text for the ok button
    okClass: '', // A class for the ok button
    closeWithEscape: false, // Allow closing with escaping
    absolute: false // Show prompt popup as absolute
  },
  confirm: {
    confirmText: 'Confirm', // The text for the confirm button
    confirmClass: '', // A class for the confirm button
    cancelText: 'Cancel', // The text for the cancel button
    cancelClass: '', // A class for the cancel button
    closeWithEscape: true, // Allow closing with escaping
    absolute: false // Show prompt popup as absolute
  },
  prompt: {
    inputType: 'text', // The type of input 'text' | 'password' etc.
    submitText: 'Submit', // The text for the submit button
    submitClass: '', // A class for the submit button
    cancelText: 'Cancel', // The text for the cancel button
    cancelClass: '', // A class for the cancel button
    closeWithEscape: true, // Allow closing with escaping
    absolute: false // Show prompt popup as absolute
  },
  toasts: {
    direction: 'top', // Which direction to show the toast  'top' | 'bottom'
    max: 1, // The number of toasts that can be in the stack
    duration: 2000, // The time the toast appears
    showTimerBar: true, // Show timer bar countdown
    closeWithEscape: true, // Allow closing with escaping
    allowClose: false // Whether to show a "x" to close the toast
  }
});
