import './style.css';

console.log(window.crossOriginIsolated)
document.querySelector('#app')!.innerHTML = `
  <div class="container">
    <div class="editor">
      <textarea>loading.....</textarea>
    </div>
    <div class="preview">
      <iframe src="preview/index.html"></iframe>
    </div>
  </div>
`;

import { WebContainer } from '@webcontainer/api';
import { files } from './webContainerSideFiles';

let webcontainerInstance:WebContainer;

window.addEventListener('load', async () => {
  // Call only once
  webcontainerInstance = await WebContainer.boot();
  await webcontainerInstance.mount(files);

  const packageJSON = await webcontainerInstance.fs.readFile('package.json', 'utf-8');
  console.log(packageJSON);

  const installProcess = await webcontainerInstance.spawn('npm', ['install']);
  
  if (await installProcess.exit !== 0) {
    throw new Error('Installation failed');
  };

  const textareaEl = document.querySelector('textarea') as HTMLTextAreaElement;
  if (textareaEl != null) {
    const fileNode = files['index.ts'];
    if ('file' in fileNode) {
      textareaEl.value = fileNode.file.contents as string;
      textareaEl.addEventListener('input', (_event) => {
        writeIndexJS(textareaEl.value);
      });
    }
  }
  

  startDevServer();
});

const startDevServer = async () => {
  console.log('npm run start!!!');
  await webcontainerInstance.spawn('npm', ['run', 'start']);
  
  const iframeEl = document.querySelector('iframe');
  // Wait for `server-ready` event
  webcontainerInstance.on('server-ready', (_port, url) => {
    if(iframeEl!=null) {
      iframeEl.src = url;
    }
  });
}

const writeIndexJS = async (content:string) => {
  await webcontainerInstance.fs.writeFile('/index.ts', content);
};
