// iQ-Studio docs — the single list of pages shown in every docs sidebar.
// Add / rename / reorder a page HERE and all docs pages pick it up.
// Each entry: [sidebar title, page path from the site root, e.g. 'docs/sdks/geniex.html']. Use '#' as the file for a "coming soon" page.
window.IQ_PAGES = {
  SIDE: [
  { name: 'Starting Guides', pages: [['Starting Guides Overview', 'docs/index.html'], ['Q911 Quick Start Guide', 'docs/starting-guides/q911-quick-start.html'], ['Q911 Image Flashing Guide', 'docs/starting-guides/q911-image-flashing.html'], ['Windows Flashing Guide', 'docs/starting-guides/windows-flashing.html'], ['Qualcomm OTA Guide', 'docs/starting-guides/qualcomm-ota.html']] },
  { name: 'AVL (Approved Vendor List)', pages: [['Approved Vendor List', 'docs/avl/vendor-list.html'], ['GMSL Camera', 'docs/avl/gmsl-camera.html'], ['MIPI Camera', 'docs/avl/mipi-camera.html']] },
  { name: 'Applications', pages: [['Applications Overview', 'docs/applications/overview.html'], ['How to Use iqs-launcher', 'docs/applications/iqs-launcher.html'], ['iQS-VLM', 'docs/applications/iqs-vlm.html'], ['iQS-QVADK', 'docs/applications/iqs-qvadk.html'], ['iQS-Streampipe', 'docs/applications/iqs-streampipe.html'], ['YOLOv10n INT8 Inference on GPU and NPU', 'docs/applications/yolov10n.html']] },
  { name: 'Model Deploy', pages: [['Model Deploy Overview', 'docs/model-deploy/overview.html'], ['Model Deploy: How to Convert, Optimize, and Perform Inference with YOLO26 Models', 'docs/model-deploy/yolo26.html'], ['iQ-Foundry Model Selection Guide', 'docs/model-deploy/iq-foundry-model-selection.html']] },
  { name: 'SDKs', pages: [['SDKs Overview', 'docs/sdks/overview.html'], ['iQS-VLM: Chat with the VLM through Open WebUI', 'docs/sdks/iqs-vlm-open-webui.html'], ['iQS-Streampipe: How to Change the Custom Model and Video Source', 'docs/sdks/iqs-streampipe.html'], ['iQS-QVADK: How to Switch and Run the Applications', 'docs/sdks/iqs-qvadk.html'], ['GenieX: Run Your Own LLM/VLM on the Platform', 'docs/sdks/geniex.html']] },
  { name: 'Benchmarks', pages: [['Benchmarks Overview', 'docs/benchmarks/overview.html'], ['Multi-stream Inference Status', 'docs/benchmarks/multi-stream.html'], ['Multi-stream Scaling Across Resolutions', 'docs/benchmarks/multistream-scaling.html'], ['Perception AI Benchmark', 'docs/benchmarks/perception.html'], ['iQ-Foundry Model Benchmark', 'docs/benchmarks/iq-foundry-models.html']] }
]
};

// Resolve a page path (relative to the site root) to a URL that works from any page depth.
// The site root is found from this script's own location: <root>/assets/js/iq-pages.js
(function () {
  if (typeof document === 'undefined') return;
  var el = document.currentScript || document.querySelector('script[src*="iq-pages.js"]');
  var root = el && el.src ? el.src.replace(/assets\/js\/[^\/]*$/, '') : '';
  window.IQ_PAGES.url = function (file) { return root + file; };
})();
