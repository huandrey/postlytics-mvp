(function () {
  const sendToHost = (type, payload) => {
    window.parent.postMessage({ type, payload }, "*");
  };

  window.onerror = (msg, url, line, col, err) => {
    console.log('onError send')
    sendToHost("ERROR", {
      message: msg,
      file: url,
      line,
      col,
      stack: err?.stack || null
    });
  };

  window.addEventListener("unhandledrejection", (event) => {
    console.log('unhandledrejection send')
    sendToHost("ERROR", {
      message: "Unhandled Promise rejection",
      reason: event.reason
    });
  });

  // Clique em elementos
  document.addEventListener("click", (e) => {
    console.log('click send')

    const el = e.target.closest("[data-element]");
    if (el) {
      sendToHost("CLICK", {
        id: el.getAttribute("data-element"),
        tag: el.tagName,
        timestamp: Date.now()
      });
    }
  });

  // Impressões
  const observer = new IntersectionObserver((entries) => {
    console.log('impression send')
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        sendToHost("IMPRESSION", {
          tag: entry.target.tagName,
          trackId: entry.target.getAttribute("data-track")
        });
        observer.unobserve(entry.target);
      }
    });
  });

  document.querySelectorAll("[data-track]").forEach(el => observer.observe(el));
})();
