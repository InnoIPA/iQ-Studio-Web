// The single source for the iQ-Studio architecture diagram.
// Used by:
//   - Architecture page  (iQ-Studio Architecture.dc.html reads window.IQ_FAMILY at runtime)
//   - Home page          (node build.js regenerates the block between <!-- @family --> … <!-- @end:family -->)
// Edit a name / status / link HERE, run `node build.js`, and both pages follow.
//
// Entity rules (carried over from iq-studio.yaml):
//   id          never renamed once created; change `name` instead. When merging or renaming keep the old entity and add replaced_by.
//   provider    innodisk | qualcomm
//   status      supported (solid) | planned (dashed) | anything else is not drawn
//   layer       only on top-level entities (cards); children use `parent`
//   group       label of the group a child sits in inside its card
//   subtitle    one line under the card title (shown on the diagram); `note` is internal and never shown
//   display:'tag'  child drawn as a tag next to the title instead of a chip
//   deprecated  not drawn, data and id kept; replaced_by points to the replacement
//   accent      card drawn with the accent colour (Developer Hub)
//   hide_title  card without a title (hardware)
//   placement:'base_band'  narrow band across the bottom of a layer (Qualcomm Linux)
//   confidence  confirmed | user_stated | inferred
//   An entity without `evidence`, or with an unknown status, is not drawn.
//   No build / release / version information and no arrows.
//
// Presentation fields added for the pages:
//   href        where the item links to on the home page (site page, or https:// for an external site)
//   flex        relative width of a card inside its layer
//   layout      'inline' puts the title and its tiles on one line
//   badge       'live' draws the green dot on a hardware tile
//
// `details` is the text of the Architecture page's side panel, one entry per card; chips are plain labels.
// Each entry carries `refs`: where its sentences come from. Nothing without a source goes in.
(function () {
  var DOC = function (n) { return 'iQ-Studio Docs ' + n + '.dc.html'; };
  var PAGE = function (n) { return 'iQ-Studio ' + n + '.dc.html'; };
  var GH = 'https://github.com/InnoIPA/';
  var QLI = 'https://www.qualcomm.com/developer/software/qualcomm-linux';
  var X = 'https://www.qualcomm.com/developer/software/';

  var layers = [
    { id: 'entry', label: 'DEVELOPER ECOSYSTEM' },
    { id: 'poc', label: 'DEMOS' },
    { id: 'tools', label: 'DEVELOPMENT TOOLS' },
    { id: 'sdks', label: 'SDKs' },
    { id: 'platform', label: 'PLATFORM SOFTWARE' },
    { id: 'system', label: 'OPERATING SYSTEM' },
    { id: 'hardware', label: 'HARDWARE' }
  ];

  var entities = [
    // ---------- ENTRY ----------
    { id: 'hub', kind: 'portal', name: 'Developer Hub', subtitle: 'Explore Documentation & Resources', accent: true, tags: ['public'], provider: 'innodisk', status: 'supported', layer: 'entry', evidence: ['src.iqstudio-readme'], confidence: 'confirmed', note: '名稱為暫名', href: PAGE('Docs'), flex: 3 },
    { id: 'hub.guides', kind: 'doc_category', name: 'Starting Guides', provider: 'innodisk', status: 'supported', parent: 'hub', group: 'GET STARTED', evidence: ['src.iqstudio-readme'], confidence: 'confirmed', href: PAGE('Docs') },
    { id: 'hub.avl', kind: 'doc_category', name: 'AVL', provider: 'innodisk', status: 'supported', parent: 'hub', group: 'GET STARTED', evidence: ['src.iqstudio-readme'], confidence: 'confirmed', href: DOC('AVL Vendor List') },
    { id: 'hub.poc', kind: 'doc_category', name: 'Demo', provider: 'innodisk', status: 'supported', parent: 'hub', group: 'DEVELOP', evidence: ['src.iqstudio-readme', 'user.2026-11-05'], confidence: 'confirmed', href: DOC('Applications Overview') },
    { id: 'hub.sdks', kind: 'doc_category', name: 'SDKs', provider: 'innodisk', status: 'supported', parent: 'hub', group: 'DEVELOP', evidence: ['src.iqstudio-readme'], confidence: 'confirmed', href: DOC('SDKs Overview') },
    { id: 'hub.deploy', kind: 'doc_category', name: 'Model Deploy', provider: 'innodisk', status: 'supported', parent: 'hub', group: 'DEVELOP', evidence: ['src.iqstudio-readme'], confidence: 'confirmed', href: DOC('Model Deploy Overview') },
    { id: 'hub.bench', kind: 'doc_category', name: 'Benchmark', provider: 'innodisk', status: 'supported', parent: 'hub', group: 'EVALUATE', evidence: ['src.iqstudio-readme'], confidence: 'confirmed', href: PAGE('Benchmarks') },
    { id: 'hub.bench.tool', kind: 'tool', name: 'Tool', deprecated: true, replaced_by: 'tool.benchmark', provider: 'innodisk', status: 'planned', parent: 'hub.bench', evidence: ['user.2026-11-05'], confidence: 'user_stated', note: '之後基於 iQ-Streampipe 程式碼產出' },
    { id: 'hub.bench.reports', kind: 'resource', name: 'Reports', deprecated: true, replaced_by: 'hub.bench', provider: 'innodisk', status: 'supported', parent: 'hub.bench', evidence: ['src.iqstudio-readme'], confidence: 'inferred', note: '內容與是否對客戶公開待確認' },

    // ---------- PoC ----------
    { id: 'poc.streampipe', kind: 'poc', name: 'iQ-Streampipe', subtitle: 'Multi-stream video pipeline · Demo now, open source soon', provider: 'innodisk', status: 'supported', layer: 'poc', tags: ['public'], evidence: ['user.2026-11-05', 'user.2026-11-09', 'src.streampipe'], confidence: 'user_stated', note: '開源後改 supported；標籤依使用者指定寫 public', href: DOC('Applications iQS-Streampipe') },
    { id: 'poc.streampipe.cv', kind: 'capability', name: 'CV Inference', provider: 'innodisk', status: 'supported', parent: 'poc.streampipe', evidence: ['user.2026-11-05'], confidence: 'user_stated' },
    { id: 'poc.streampipe.stream', kind: 'capability', name: 'Streaming', provider: 'innodisk', status: 'supported', parent: 'poc.streampipe', evidence: ['user.2026-11-05'], confidence: 'user_stated' },
    { id: 'poc.streampipe.benchmark', kind: 'capability', name: 'Benchmark', provider: 'innodisk', status: 'supported', parent: 'poc.streampipe', evidence: ['user.2026-11-05', 'user.2026-11-09'], confidence: 'user_stated', note: '取代獨立的 iQ-Benchmark 卡片（2026-11-09 使用者指定併入）', href: DOC('Benchmark Multi-stream') },
    { id: 'poc.streampipe.multi', kind: 'capability', name: 'Multi-channel', provider: 'innodisk', status: 'supported', parent: 'poc.streampipe', evidence: ['user.2026-11-05'], confidence: 'user_stated' },
    { id: 'poc.streampipe.video', kind: 'capability', name: 'Video', deprecated: true, provider: 'innodisk', status: 'planned', parent: 'poc.streampipe', evidence: ['src.streampipe', 'user.2026-11-08'], confidence: 'user_stated', note: '原 Video Input，使用者指定寫 Video' },
    { id: 'poc.vlm', kind: 'poc', name: 'iQ-VLM', subtitle: 'Vision-language models', tags: ['public'], provider: 'innodisk', status: 'supported', layer: 'poc', evidence: ['src.vlm'], confidence: 'confirmed', href: DOC('Applications iQS-VLM') },
    { id: 'poc.vlm.live', kind: 'capability', name: 'Streaming', provider: 'innodisk', status: 'supported', parent: 'poc.vlm', evidence: ['src.vlm'], confidence: 'confirmed' },
    { id: 'poc.vlm.chat', kind: 'capability', name: 'Chat', provider: 'innodisk', status: 'supported', parent: 'poc.vlm', evidence: ['src.vlm'], confidence: 'confirmed', href: DOC('SDK iQS-VLM Open WebUI') },
    { id: 'poc.vlm.agent', kind: 'capability', name: 'Agent AI', provider: 'innodisk', status: 'planned', parent: 'poc.vlm', evidence: ['user.2026-11-09'], confidence: 'user_stated' },
    { id: 'poc.robo', kind: 'poc', name: 'iQ-Robo', deprecated: true, provider: 'innodisk', status: 'planned', layer: 'poc', evidence: ['user.2026-11-06'], confidence: 'user_stated', note: '2026-11-08 使用者要求從圖上拿掉（資料保留，deprecated）；之後要加回把 deprecated 拿掉即可' },

    // ---------- TOOLS ----------
    { id: 'tool.foundry', kind: 'tool', name: 'iQ-Foundry', subtitle: 'Model quantization and on-device validation', tags: ['public'], provider: 'innodisk', status: 'supported', layer: 'tools', evidence: ['src.foundry'], confidence: 'confirmed', href: GH + 'iQ-Foundry' },
    { id: 'tool.foundry.yolo', kind: 'capability', name: 'Object Detection', provider: 'innodisk', status: 'supported', parent: 'tool.foundry', group: 'CV MODEL', evidence: ['src.foundry'], confidence: 'confirmed' },
    { id: 'tool.foundry.seg', kind: 'capability', name: 'Segmentation', provider: 'innodisk', status: 'planned', parent: 'tool.foundry', group: 'CV MODEL', evidence: ['user.2026-11-05'], confidence: 'user_stated' },
    { id: 'tool.foundry.pose', kind: 'capability', name: 'Pose Estimation', provider: 'innodisk', status: 'planned', parent: 'tool.foundry', group: 'CV MODEL', evidence: ['user.2026-11-05'], confidence: 'user_stated' },
    { id: 'tool.foundry.cls', kind: 'capability', name: 'Classification', provider: 'innodisk', status: 'planned', parent: 'tool.foundry', group: 'CV MODEL', evidence: ['user.2026-11-05'], confidence: 'user_stated' },
    { id: 'tool.foundry.int8', kind: 'capability', name: 'INT8', provider: 'innodisk', status: 'supported', parent: 'tool.foundry', group: 'PRECISION', evidence: ['src.foundry'], confidence: 'confirmed' },
    { id: 'tool.foundry.w8a16', kind: 'capability', name: 'W8A16', provider: 'innodisk', status: 'supported', parent: 'tool.foundry', group: 'PRECISION', evidence: ['src.foundry'], confidence: 'confirmed' },
    { id: 'tool.foundry.fp16', kind: 'capability', name: 'FP16', provider: 'innodisk', status: 'supported', parent: 'tool.foundry', group: 'PRECISION', evidence: ['src.foundry'], confidence: 'confirmed' },
    { id: 'tool.foundry.tflite', kind: 'format', name: 'TFLite', provider: 'innodisk', status: 'supported', parent: 'tool.foundry', group: 'SUPPORT', evidence: ['src.foundry'], confidence: 'confirmed' },
    { id: 'tool.foundry.onnx', kind: 'format', name: 'ONNX', provider: 'innodisk', status: 'supported', parent: 'tool.foundry', group: 'SUPPORT', evidence: ['src.foundry'], confidence: 'confirmed' },
    { id: 'tool.foundry.qnn', kind: 'format', name: 'QNN', provider: 'innodisk', status: 'supported', parent: 'tool.foundry', group: 'SUPPORT', evidence: ['src.foundry', 'user.2026-11-05'], confidence: 'user_stated', note: '實際為 QAIRT HTP context binary，名稱依使用者指定' },
    { id: 'tool.benchmark', kind: 'tool', name: 'iQ-Benchmark', deprecated: true, replaced_by: 'poc.streampipe.benchmark', provider: 'innodisk', status: 'planned', layer: 'tools', evidence: ['user.2026-11-05', 'user.2026-11-08'], confidence: 'user_stated', note: '之後基於 iQ-Streampipe 程式碼產出；尚無 repo，沒有子項目與副標，只畫虛線區塊' },

    // ---------- SDKS (Qualcomm) ----------
    { id: 'sdks.qualcomm', kind: 'sdk_suite', name: 'Qualcomm SDKs', provider: 'qualcomm', status: 'supported', layer: 'sdks', evidence: ['user.2026-11-06'], confidence: 'user_stated', layout: 'inline' },
    { id: 'sdk.qim', kind: 'sdk', name: 'QIM', provider: 'qualcomm', status: 'supported', parent: 'sdks.qualcomm', group: 'MULTIMEDIA', evidence: ['user.2026-11-05', 'user.2026-11-06'], confidence: 'user_stated', note: 'Qualcomm Intelligent Multimedia SDK', href: 'https://imsdkdocs.qualcomm.com/' },
    { id: 'sdk.qairt', kind: 'sdk', name: 'QAIRT', provider: 'qualcomm', status: 'supported', parent: 'sdks.qualcomm', group: 'AI RUNTIME', evidence: ['user.2026-11-05', 'user.2026-11-06'], confidence: 'user_stated', note: 'Qualcomm AI Runtime', href: X + 'qualcomm-ai-runtime-sdk-qairt' },
    { id: 'sdk.geniex', kind: 'sdk', name: 'GenieX', provider: 'qualcomm', status: 'supported', parent: 'sdks.qualcomm', group: 'GEN AI', evidence: ['src.vlm', 'user.2026-11-06'], confidence: 'confirmed', href: 'https://geniex.aihub.qualcomm.com/en/get-started/what-is-geniex' },
    { id: 'sdk.qirp', kind: 'sdk', name: 'QIRP', provider: 'qualcomm', status: 'supported', parent: 'sdks.qualcomm', group: 'ROBOTICS', evidence: ['user.2026-11-05', 'user.2026-11-06'], confidence: 'user_stated', note: 'Qualcomm Intelligent Robotics Product SDK', href: X + 'qualcomm-intelligent-robotics-product-sdk' },

    // ---------- SYSTEM / PLATFORM ----------
    { id: 'sys.meta', kind: 'product', name: 'iQ-Meta', subtitle: 'Board support package', provider: 'innodisk', status: 'supported', layer: 'system', evidence: ['src.meta-iq', 'src.iqstudio-readme'], confidence: 'confirmed', note: 'iQ-Ubuntu 併入', href: DOC('Q911 Image Flashing'), flex: 2 },
    { id: 'sys.meta.yocto', kind: 'capability', name: 'Yocto', provider: 'innodisk', status: 'supported', parent: 'sys.meta', group: 'BSP SUPPORT', evidence: ['src.iqstudio-readme'], confidence: 'confirmed' },
    { id: 'sys.meta.ubuntu', kind: 'capability', name: 'Ubuntu', provider: 'innodisk', status: 'supported', parent: 'sys.meta', group: 'BSP SUPPORT', evidence: ['src.iqstudio-readme'], confidence: 'confirmed' },
    { id: 'sys.meta.sbom', kind: 'capability', name: 'SBOM', provider: 'innodisk', status: 'supported', parent: 'sys.meta', group: 'CRA', evidence: ['src.meta-iq'], confidence: 'confirmed', note: '是否涵蓋 Ubuntu image 待確認' },
    { id: 'sys.meta.cve', kind: 'capability', name: 'CVE', provider: 'innodisk', status: 'supported', parent: 'sys.meta', group: 'CRA', evidence: ['user.2026-11-06'], confidence: 'user_stated', note: '具體做了什麼（掃描、報告、修補）與是否涵蓋 CAM、OTA 待確認' },
    { id: 'sys.meta.android', kind: 'capability', name: 'Android', provider: 'innodisk', status: 'planned', parent: 'sys.meta', group: 'BSP SUPPORT', evidence: ['user.2026-11-05'], confidence: 'user_stated' },
    { id: 'sys.meta.windows', kind: 'capability', name: 'Windows', provider: 'innodisk', status: 'supported', parent: 'sys.meta', group: 'BSP SUPPORT', evidence: ['user.2026-11-05', 'user.2026-11-09'], confidence: 'user_stated' },
    { id: 'sys.cam', kind: 'product', name: 'iQ-CAM', subtitle: 'Camera drivers', provider: 'innodisk', status: 'supported', layer: 'platform', evidence: ['src.iq-cam'], confidence: 'confirmed', href: GH + 'iQ-Cam__manifest' },
    { id: 'sys.cam.mipi', kind: 'capability', name: 'MIPI', provider: 'innodisk', status: 'supported', parent: 'sys.cam', evidence: ['src.iq-cam'], confidence: 'confirmed' },
    { id: 'sys.cam.gmsl', kind: 'capability', name: 'GMSL', provider: 'innodisk', status: 'supported', parent: 'sys.cam', evidence: ['src.iq-cam'], confidence: 'confirmed' },
    { id: 'sys.cam.avl', kind: 'capability', name: 'AVL', provider: 'innodisk', status: 'supported', parent: 'sys.cam', evidence: ['user.2026-11-09'], confidence: 'user_stated' },
    { id: 'sys.ota', kind: 'product', name: 'iQ-OTA', subtitle: 'Firmware and OS update', provider: 'innodisk', status: 'supported', layer: 'platform', evidence: ['src.ota'], confidence: 'confirmed', href: DOC('Qualcomm OTA') },
    { id: 'sys.ota.capsule', kind: 'capability', name: 'Capsule', provider: 'innodisk', status: 'supported', parent: 'sys.ota', evidence: ['src.ota'], confidence: 'confirmed' },
    { id: 'sys.ota.ostree', kind: 'capability', name: 'OSTree', provider: 'innodisk', status: 'supported', parent: 'sys.ota', evidence: ['src.ota'], confidence: 'confirmed' },
    { id: 'sys.ota.secboot', kind: 'capability', name: 'Secure Boot', provider: 'innodisk', status: 'supported', parent: 'sys.ota', evidence: ['user.2026-11-09'], confidence: 'user_stated', note: '使用者寫 security boot，圖上用 Secure Boot' },
    // Qualcomm Linux: a band across the bottom of the system layer; no version
    { id: 'sys.qli', kind: 'os', name: 'Qualcomm Linux', provider: 'qualcomm', status: 'supported', layer: 'system', placement: 'base_band', evidence: ['src.iqstudio-readme', 'user.2026-11-06'], confidence: 'confirmed', href: QLI },

    // ---------- HARDWARE ----------
    { id: 'hw', kind: 'group', name: 'Platforms', hide_title: true, provider: 'innodisk', status: 'supported', layer: 'hardware', evidence: ['src.iqstudio-readme'], confidence: 'confirmed' },
    { id: 'hw.iq9', kind: 'platform', name: 'IQ9 · EXEC-Q911 · IQ-9075', provider: 'innodisk', status: 'supported', parent: 'hw', evidence: ['src.iqstudio-readme', 'src.meta-iq'], confidence: 'confirmed', badge: 'live', href: 'https://www.innodisk.com/cht/products/computing/qualcomm-solution/exmp-q911' },
    { id: 'hw.iq8', kind: 'platform', name: 'IQ8 · EXEC-Q801 · IQ-8275', provider: 'innodisk', status: 'supported', parent: 'hw', evidence: ['src.meta-iq', 'user.2026-11-05', 'user.2026-11-08'], confidence: 'user_stated', note: '對應 EXMP-Q801 · QCS8275（使用者確認）；圖上先只寫 IQ8，之後可改回完整寫法' },
    { id: 'hw.iq10', kind: 'platform', name: 'IQ10', provider: 'innodisk', status: 'planned', parent: 'hw', evidence: ['user.2026-11-05'], confidence: 'user_stated', note: '沒有型號' },
    { id: 'hw.iqx', kind: 'platform', name: 'IQ-X · APEX-A300 · EXDU-QX11', provider: 'innodisk', status: 'planned', parent: 'hw', evidence: ['user.2026-11-08'], confidence: 'user_stated' },

    // ---------- iQ-Club (same layer as Developer Hub, side by side) ----------
    { id: 'club', kind: 'community', name: 'iQ-Club', subtitle: 'Articles and discussion', tags: ['public'], provider: 'innodisk', status: 'supported', layer: 'entry', evidence: ['user.2026-11-05'], confidence: 'user_stated', flex: 1 },
    { id: 'club.linkedin', kind: 'resource', name: 'LinkedIn', provider: 'innodisk', status: 'supported', parent: 'club', evidence: ['user.2026-11-05'], confidence: 'user_stated', note: '連結尚未提供' },
    { id: 'club.news', kind: 'resource', name: 'News', provider: 'innodisk', status: 'supported', parent: 'club', evidence: ['user.2026-11-08'], confidence: 'user_stated', note: '原 In the News，使用者指定寫 News', href: PAGE('In the News') },
    { id: 'club.discord', kind: 'resource', name: 'Discord', provider: 'innodisk', status: 'planned', parent: 'club', evidence: ['user.2026-11-05'], confidence: 'user_stated', note: '連結尚未提供' }
  ];

  // Side panel on the Architecture page: one entry per card, chips are plain labels.
  // Every sentence below is taken from an existing page of this site or from the diagram data above (the entity
  // fields: name, subtitle, status, group, note). `refs` says where each card's text comes from. Do not add a claim
  // that has no entry in refs.
  //   Docs: <page>   = the page iQ-Studio Docs <page>.dc.html
  //   Page: <page>   = iQ-Studio <page>.dc.html
  //   Data: <id>     = the entity of that id in this file
  //   Architecture (previous version) = text of the Architecture page before it was rebuilt from this file
  var details = {
    hub: { desc: 'Documentation, demos and benchmarks.', summary: 'Explore documentation and resources for iQ-Studio on Innodisk Qualcomm Dragonwing platforms.', points: ['Get started: Starting Guides get the device powered on, flashed and reachable before running anything else. AVL lists the Innodisk camera and peripheral modules validated for iQ-Studio platforms.', 'Develop: Demo, SDKs and Model Deploy.', 'Evaluate: Benchmark.'], links: [{ label: 'Starting Guides', href: PAGE('Docs') }, { label: 'Approved Vendor List', href: DOC('AVL Vendor List') }, { label: 'Applications overview', href: DOC('Applications Overview') }, { label: 'SDKs overview', href: DOC('SDKs Overview') }, { label: 'Model Deploy overview', href: DOC('Model Deploy Overview') }, { label: 'Benchmarks', href: PAGE('Benchmarks') }], refs: ['Data: hub (subtitle, groups)', 'Docs: Starting Guides Overview', 'Docs: AVL Vendor List'] },

    club: { desc: 'Articles and discussion.', summary: 'Articles and discussion.', points: ['LinkedIn and News are supported; Discord is planned.', 'News: media coverage, deployments and ecosystem case studies about the Innodisk Qualcomm Dragonwing platforms.'], links: [{ label: 'In the News', href: PAGE('In the News') }], refs: ['Data: club (subtitle, children, status)', 'Page: In the News (description)'] },

    'poc.streampipe': { desc: 'Multi-stream video pipeline.', summary: 'A C++ GStreamer and OpenCV multi-stream video processing pipeline. It takes real-time input from UVC cameras or video files and shows the channels as one composite output.', points: ['CV inference, streaming, multi-channel and benchmark.', 'Change the model and video source in config.json.', 'Demo available now. Source code to be open-sourced.'], links: [{ label: 'iQS-Streampipe guide', href: DOC('Applications iQS-Streampipe') }, { label: 'Custom model & source', href: DOC('SDK iQS-Streampipe') }, { label: 'Multi-stream inference status', href: DOC('Benchmark Multi-stream') }, { label: 'Multi-stream scaling across resolutions', href: DOC('Benchmark Multistream Scaling') }], refs: ['Docs: Applications iQS-Streampipe (summary)', 'Data: poc.streampipe and its children (capabilities)', 'Docs: SDK iQS-Streampipe (config.json)', 'Docs: Benchmark Multi-stream, Benchmark Multistream Scaling'] },

    'poc.vlm': { desc: 'Vision-language models.', summary: 'Reads a live video stream from a UVC camera, asks a vision-language model to describe what it sees, and shows the description on a fullscreen dashboard on the monitor. Powered by GenieX.', points: ['Runs as a single command: iqs-launcher --autotag iqs-vlm-demo.', 'Chat with the VLM through Open WebUI.', 'Agent AI is planned.'], links: [{ label: 'iQS-VLM guide', href: DOC('Applications iQS-VLM') }, { label: 'Chat through Open WebUI', href: DOC('SDK iQS-VLM Open WebUI') }], refs: ['Docs: Applications iQS-VLM (summary, LFM2.5-VL-450M on the NPU, GenieX)', 'Page: Home (iqs-launcher --autotag iqs-vlm-demo)', 'Docs: SDK iQS-VLM Open WebUI', 'Data: poc.vlm.agent (status planned)'] },

    'tool.foundry': { desc: 'Model quantization and on-device validation.', summary: 'Model quantization and on-device validation: the end-to-end workflow for converting, optimizing and running your own AI models.', points: ['Precision: INT8, W8A16 and FP16.', 'CV model: object detection is supported; segmentation, pose estimation and classification are planned.', 'Formats: TFLite, ONNX and QNN.', 'The Model Selection Guide helps you choose the precision and runtime that best match your accuracy, speed and deployment requirements.'], links: [{ label: 'InnoIPA/iQ-Foundry', href: GH + 'iQ-Foundry' }, { label: 'Model Deploy overview', href: DOC('Model Deploy Overview') }, { label: 'YOLO26 walkthrough', href: DOC('Model Deploy YOLO26') }, { label: 'Model Selection Guide', href: DOC('Model Deploy iQ-Foundry Model Selection') }, { label: 'iQ-Foundry model benchmark', href: DOC('Benchmark iQ-Foundry Models') }], refs: ['Data: tool.foundry and its children (precision, CV model, formats, status)', 'Docs: Model Deploy Overview (description)', 'Docs: Model Deploy iQ-Foundry Model Selection (description)'] },

    'sdks.qualcomm': { desc: 'Provided by Qualcomm.', summary: 'SDKs provided by Qualcomm.', points: ['QIM: Qualcomm Intelligent Multimedia SDK.', 'QAIRT: Qualcomm AI Runtime.', 'GenieX: Qualcomm\'s on-device generative AI inference runtime. It runs LLMs and VLMs locally on the Hexagon NPU, the Adreno GPU or the CPU, with no cloud connection. Use it from the CLI, an OpenAI-compatible server or Python.', 'QIRP: Qualcomm Intelligent Robotics Product SDK.'], links: [{ label: 'QIM SDK documentation', href: 'https://imsdkdocs.qualcomm.com/' }, { label: 'QAIRT developer page', href: X + 'qualcomm-ai-runtime-sdk-qairt' }, { label: 'GenieX documentation', href: 'https://geniex.aihub.qualcomm.com/en/get-started/what-is-geniex' }, { label: 'Run your own LLM/VLM with GenieX', href: DOC('SDK GenieX') }, { label: 'QIRP SDK developer page', href: X + 'qualcomm-intelligent-robotics-product-sdk' }], refs: ['Data: sdk.qim, sdk.qairt, sdk.qirp (notes)', 'Docs: SDK GenieX (description)', 'Docs: SDKs Overview (CLI, OpenAI-compatible server, Python)'] },

    'sys.cam': { desc: 'Camera drivers.', summary: 'Camera drivers.', points: ['MIPI and GMSL.', 'Camera driver patches are maintained in the iQ-Cam__manifest repository.', 'AVL: Innodisk camera modules (GMSL, MIPI CSI-2).'], links: [{ label: 'InnoIPA/iQ-Cam__manifest', href: GH + 'iQ-Cam__manifest' }], refs: ['Data: sys.cam and its children (subtitle, MIPI, GMSL, AVL)', 'Docs: AVL Vendor List (camera driver patches, validated modules)'] },

    'sys.ota': { desc: 'Firmware and OS update.', summary: 'Update firmware and operating systems on Qualcomm Linux platforms with Capsule and OSTree.', points: ['Capsule: uses a UEFI capsule to update firmware on Qualcomm Linux devices. The capsule is downloaded to the EFI partition during normal operation and applied automatically on the next reboot.', 'OSTree: provides atomic, version-controlled Linux OS updates. Devices pull filesystem snapshots from a repository, allowing for safe rollbacks if an update fails.', 'Secure Boot is listed under iQ-OTA.'], links: [{ label: 'Qualcomm OTA Guide', href: DOC('Qualcomm OTA') }, { label: 'Q911 Image Flashing Guide', href: DOC('Q911 Image Flashing') }], refs: ['Docs: Qualcomm OTA (description, Capsule Update, OSTree Update)', 'Data: sys.ota.secboot (listed as a child; the OTA guide does not cover it)'] },

    'sys.meta': { desc: 'Board support package.', summary: 'The inno meta-iq Yocto layer: Innodisk\'s device tree and downstream drivers on top of Qualcomm Linux, for Innodisk Qualcomm Dragonwing platforms.', points: ['Turns a generic Qualcomm Linux distribution into a validated system image for Innodisk hardware, published as a reproducible Yocto manifest.', 'Yocto: iQ-Studio is developed and validated on the Yocto-based Innodisk BSP.', 'Ubuntu: to keep all IO functions working correctly, use the Innodisk-provided Ubuntu image. The official Ubuntu image from Qualcomm can boot on the platform but does not guarantee full IO support.', 'Windows is supported; Android is planned.', 'CRA: SBOM and CVE.'], links: [{ label: 'InnoIPA/meta-iQ__manifest', href: GH + 'meta-iQ__manifest' }, { label: 'Q911 Image Flashing Guide', href: DOC('Q911 Image Flashing') }, { label: 'BSP & Qualcomm Linux releases', href: '#bsp-qli' }], refs: ['Architecture (previous version): inno DTB / drivers, OS images', 'Data: sys.meta and its children (Windows, Android, CRA: SBOM and CVE)'] },

    'sys.qli': { desc: 'Provided by Qualcomm.', summary: 'The Qualcomm Linux distribution: kernel, firmware and SoC drivers, packaged by Qualcomm. It is the upstream layer Innodisk\'s BSP builds on.', points: ['Each Qualcomm Linux release line is tied to one Linux kernel and one Yocto Project version.'], links: [{ label: 'Qualcomm Linux', href: QLI }, { label: 'BSP & Qualcomm Linux releases', href: '#bsp-qli' }], refs: ['Architecture (previous version): Qualcomm Linux', 'This page: BSP & QLI releases'] },

    hw: { desc: 'Innodisk Qualcomm Dragonwing platforms.', summary: 'Innodisk Qualcomm Dragonwing platforms.', points: ['IQ9 (EXEC-Q911, IQ-9075) and IQ8 (EXEC-Q801, IQ-8275) are supported.', 'IQ10 and IQ-X (APEX-A300, EXDU-QX11) are planned.'], links: [{ label: 'EXMP-Q911', href: 'https://www.innodisk.com/cht/products/computing/qualcomm-solution/exmp-q911' }, { label: 'Q911 Quick Start Guide', href: DOC('Q911 Quick Start') }], refs: ['Data: hw and its children (names, status)'] }
  };

  window.IQ_FAMILY = { title: 'iQ-Studio', layers: layers, entities: entities, details: details };
})();
