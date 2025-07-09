/**
 * Helper function to trigger a message handler for testing
 * This allows testing of functions that add message event listeners to the window
 * without having to mock the entire MessageEvent infrastructure
 * 
 * @param {Function} setupListener - Function that registers a message event handler (e.g., updateDRMEmbeds)
 * @param {Object} mockEvent - The mock event object to pass to the handler
 */
export function triggerMessageHandler(setupListener, mockEvent) {
    const originalAddEventListener = window.addEventListener;
    
    let messageHandler;
    
    window.addEventListener = function(eventName, handler) {
        if (eventName === 'message') {
            messageHandler = handler;
        }
        return originalAddEventListener.apply(this, arguments);
    };
    
    setupListener();
    
    window.addEventListener = originalAddEventListener;
    
    if (messageHandler) {
        messageHandler(mockEvent);
    }
}

/**
 * Creates a mock DRM initialization failure event
 * 
 * @param {string} origin - The origin of the message
 * @param {Window} sourceWindow - The source window (iframe.contentWindow)
 * @returns {Object} - A mock message event object
 */
export function createDRMInitFailedEvent(origin, sourceWindow) {
    return {
        origin,
        source: sourceWindow,
        data: JSON.stringify({
            event: 'drminitfailed'
        })
    };
}
