
let mode = 'dev';

/** Global variables */
const svgElements = [ "svg", "circle", "polygon", "rect" ];
const borderWidth = "8px";
const mar = 5;
const len = 80;

/** Configurations */
const colorDict = {
  "dark_1": '#6A1B9A',
  "dark_2": '#1565C0',
  "light_1": '#AB47BC',
  "light_2": '#64B5F6',
}
const allColors = Object.keys(colorDict);

const allShapes = [
  "circle",
  "p_3", // triangular
  "p_4", // square
  "p_5", // polygon 5 sides
  "p_6", // polygon 6 sides
  "p_7", // 7 sides
  "p_8", // 8 sides
]

const allStones = getAllStones(allColors, allShapes);

const learnTaskConfigs = sampleTasks('learn', 3);
const nLearnTasks = Object.keys(learnTaskConfigs).length;
console.log(learnTaskConfigs)

const testTaskConfigs = sampleTasks('test', 1);
const nTestTasks = Object.keys(testTaskConfigs).length;

const genTaskConfigs = sampleTasks('gen', 2);
const nGenTasks = Object.keys(genTaskConfigs).length;

/** Main body */
// document.body.append(createCustomElement("div", "section-page", "show-learning-phase"));
// document.getElementById("show-learning-phase").append(createText("h1", "Investigation starts"));

// document.body.append(createCustomElement("div", "section-page", "show-test-phase"));
// document.getElementById("show-test-phase").append(createText("h1", "Tests"));
// document.getElementById("show-test-phase").style.display = "none";

// document.body.append(createCustomElement("div", "section-page", "show-gen-phase"));
// document.getElementById("show-gen-phase").append(createText("h1", "With newly-discovered stones"));
// document.getElementById("show-gen-phase").style.display = "none";

createTaskBox(learnTaskConfigs[0], "flex");


/** Functions */
function createInitStones(config, parentDiv) {
  parentDiv.append(createStone("test", "shape", `${config.taskId}-agent`, getOpts(config.agent, true)));
  parentDiv.append(createStone("test", "shape", `${config.taskId}-recipient`, getOpts(config.recipient, false)));
  return(parentDiv);
}
function getOpts (style, isAgent) {
  const color = style.split(";")[0];
  const shape = style.split(";")[1];
  let opts = {};
  opts["color"] = colorDict[color];
  opts["hasBorder"] = isAgent;
  if (shape[0] === "p") {
    const n = shape.split("_")[1];
    opts["points"] = calcPolygon({n:n,r:40,a:0})
  } else {
    opts["cx"] = "40";
    opts["cy"] = "40";
    opts["r"] = "35";
  }
  return opts;
}
function createTaskBox (config, display = "none") {
  const taskType = config.type;
  const taskId = config.taskId;

  let index = config.index;
  let total = 0;
  // const total = nLearnTasks + nTestTasks + nGenTasks;

  switch (taskType) {
    case 'learn':
      total = nLearnTasks;
      break;
    case 'test':
      total = nTestTasks;
      break;
    case 'gen':
      total = nGenTasks;
      break;
  }

  let box = createCustomElement("div", "box", `box-${taskId}`);
  box.append(createText('h1', `
    ${mode === 'dev'? "["+ taskType + "]": ''}
    ${index}/${total}`));

  let taskBox = createCustomElement("div", "task-box", `taskbox-${taskId}`);
  let displayBox = createCustomElement("div", "display-box", `${taskId}-display-box`);
  displayBox = createInitStones(config, displayBox);

  // const buttonGroup = createCustomElement("div", "button-group", `${taskId}-button-group`);
  // if (taskType !== "learn") {
  //   buttonGroup.append(createBtn(`${taskId}-check-btn`, "Check", false))
  // } else {
  //   buttonGroup.append(createBtn(`${taskId}-play-btn`, "Play", true))
  // }

  // if (taskType !== "learn") {
  //   const recordPan = createCustomElement("div", "record-pan", `${taskId}-record-pan`);
  //   recordPan.append(createPanel(config));

  //   taskBox.append(displayBox);
  //   taskBox.append(recordPan);
  //   taskBox.append(buttonGroup);

  // } else {
    taskBox.append(displayBox);
  //   taskBox.append(buttonGroup);
  // }

  box.append(taskBox);

  // if (taskType !== "learn") {
  //   const feedbackPass = createCustomElement("div", "feedback-true", `${taskId}-true-text`);
  //   feedbackPass.append(document.createTextNode("Correct! See above for the effects summary."))
  //   feedbackPass.style.display = "none";

  //   const feedbackFail = createCustomElement("div", "feedback-false", `${taskId}-false-text`);
  //   feedbackFail.append(document.createTextNode("Wrong! See above for the real effects summary."));
  //   feedbackFail.style.display = "none";

  //   box.append(feedbackPass);
  //   box.append(feedbackFail);
  // }

  // box.append(createTextInputPanel(config, (mode === "dev" || mode === "debug")? "flex": "none"));

  document.body.append(box);
  box.style.display = display;

  // /** Button functionalities */
  // const playBtn = document.getElementById(`${taskId}-play-btn`) || null;
  // const inputForm = document.getElementById(`${taskId}-input-form`);
  // const copyBtn = document.getElementById(`${taskId}-copy-btn`);
  // const pasteBtn = document.getElementById(`${taskId}-paste-btn`);
  // const inputNextBtn = document.getElementById(`${taskId}-input-next-btn`);

  // copyBtn.onclick = () => copyText(`${taskId}-input-1`);
  // pasteBtn.onclick = () => pasteText(`${taskId}-input-1`);

  // if (taskType === "learn") {
  //   playBtn.onclick = () => {
  //     playBtn.disabled = true;
  //     playEffects(config);
  //     setTimeout(() => {
  //       clearElements(config);
  //       setTimeout(() => {
  //         displayBox = createSummaryStones(config, displayBox);
  //         showNext(`${taskId}-input`);
  //       }, 1000);
  //     }, 3500);
  //   }
  // }

  // inputForm.onchange = () => isFilled(`${taskId}-input-form`)? inputNextBtn.disabled = false: null;

  // inputNextBtn.onclick= () => {
  //   inputNextBtn.disabled = true;
  //   (taskType === "gen")? gtData = saveFormData(config, gtData) : ltData = saveFormData(config, ltData);
  //   disableFormInputs(`${taskId}-input-form`);
  //   copyBtn.disabled = false;
  //   pasteBtn.disabled = true;

  //   const taskCount = parseInt(taskId.split("-")[1]);
  //   if (taskType === "learn") {
  //     if(taskCount < nLearnTasks) {
  //       showNext(`box-learn-${fmtTaskIdx(taskCount+1)}`)
  //     } else {
  //       for(let i = 0; i < nLearnTasks; i ++) document.getElementById(`box-learn-${fmtTaskIdx(i+1)}`).style.display = "none";
  //       document.getElementById("show-test-phase").style.display = "block";
  //       setTimeout(() => {
  //         document.getElementById("show-test-phase").style.display = "none";
  //         document.getElementById("box-test-01").style.display = "flex";
  //       }, 2000);
  //     }
  //   } else if (taskType === "test") {
  //     if(taskCount < nTestTasks) {
  //       showNext(`box-test-${fmtTaskIdx(taskCount+1)}`)
  //     } else {
  //       for(let i = 0; i < nTestTasks; i ++) document.getElementById(`box-test-${fmtTaskIdx(i+1)}`).style.display = "none";
  //       document.getElementById("show-gen-phase").style.display = "block";
  //       setTimeout(() => {
  //         document.getElementById("show-gen-phase").style.display = "none";
  //         document.getElementById("box-gen-01").style.display = "flex";
  //       }, 2000);
  //     }
  //   } else {
  //     if(taskCount < nGenTasks) {
  //       showNext(`box-gen-${fmtTaskIdx(taskCount+1)}`)
  //     } else {
  //       alert("This is the last task.")
  //     }
  //   }
  // }
}
function fmtTaskIdx (counter) {
  return(counter.toString().padStart(2, '0'))
}
function sampleTasks (type, count) {
  let tasks = [];
  for(let i = 1; i <= count; i++) {
    taskConfig = {};
    taskConfig["taskId"] = type+"-"+fmtTaskIdx(i);
    taskConfig["type"] = type;
    taskConfig["index"] = i;
    taskConfig["agent"] = sampleObj(allStones);
    taskConfig["recipient"] = sampleObj(allStones);
    taskConfig["result"] = sampleObj(allStones);
    tasks.push(taskConfig);
  }
  return tasks;
}
function getAllStones (colors, shapes) {
  let stones = []
  colors.forEach(c => {
    shapes.forEach(s => stones.push(c + ';' + s))
  })
  return(stones);
}
function sampleObj (objs) {
  return(objs[Math.floor(Math.random() * objs.length)]);
}
function createStone (svgClass, shapeClass, id, opts) {
  let svg = createCustomElement("svg", svgClass, `${id}-svg`);
  if (Object.keys(opts).indexOf("points") < 0) {
    svg.append(createCircle(shapeClass, `${id}-stone`, opts))
  } else {
    svg.append(createPolygon(shapeClass, `${id}-stone`, opts))
  }
  return(svg);
}
function createPolygon(className, id, opts) {
  let polygon = createCustomElement("polygon", className, id);
  setAttributes(polygon, {
    "fill": opts.color,
    "points": opts.points,
    "stroke-width": opts.hasBorder? borderWidth : "0px",
  })
  return(polygon);
}
function createCircle (className, id, opts) {
  let circle = createCustomElement("circle", className, id);
  setAttributes(circle, {
    "cx": opts.cx,
    "cy": opts.cy,
    "r": opts.r,
    "fill": opts.color,
    "stroke-width": opts.hasBorder? borderWidth : "0px",
  })
  return(circle);
}
function calcPolygon(input) {
  // Adapted from https://gist.github.com/jonthesquirrel/e2807811d58a6627ded4
  let output = [];
  for (let i = 1; i <= input.n; i++) {
    output.push(
      ((input.r * Math.cos(input.a + 2 * i * Math.PI / input.n)) + len/2).toFixed(0).toString() + "," +
      ((input.r * Math.sin(input.a + 2 * i * Math.PI / input.n)) + len/2).toFixed(0).toString()
    )
  }
  return output.join(" ")
}
function createCustomElement (type = 'div', className, id) {
  let element = (svgElements.indexOf(type) < 0)?
    document.createElement(type):
    document.createElementNS("http://www.w3.org/2000/svg", type);
  if (className.length > 0) element.setAttribute("class", className);
  element.setAttribute("id", id);
  return element;
}
function createDivWithStyle (className = "div", id = "", style = "") {
  let element = createCustomElement('div', className, id);
  setStyle(element, style);
  return element;
}
function createText(h = "h1", text = 'hello') {
  let element = document.createElement(h);
  let tx = document.createTextNode(text);
  element.append(tx);
  return(element)
}
function setAttributes(el, attrs) {
  for(var key in attrs) {
    el.setAttribute(key, attrs[key]);
  }
}
