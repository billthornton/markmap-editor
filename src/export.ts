import domtoimage, { ConvertFunction } from "dom-to-image-more";

const downloadString = (dataURL: string, filename: string) => {
    const element = document.createElement('a');
    element.setAttribute('href', dataURL);
    element.setAttribute('download', filename);
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
};

const getSafeSVG = (backgroundColour?: string) => {
    // TODO: Need to somehow zoom in before capturing - should this be done in an invisible copy?
    const svgText = document.querySelector('.mindmap')?.outerHTML || "";
    const svgTextWithAttribute = svgText
        .replace('<svg ', '<svg xmlns="http://www.w3.org/2000/svg" ')
        .replaceAll('<br>', '<br></br>');

    const svgFileText = `<?xml version="1.0" encoding="UTF-8"?>${svgTextWithAttribute}`;

    return svgFileText;
}

export const exportClickSVG = () => {
    const svgFileText = getSafeSVG();
    const dataURL = `data:image/svg;base64,${btoa(svgFileText)}`;

    downloadString(dataURL, 'mindmap.svg');
};

const convertAndDownload = (conversionFn: ConvertFunction, filename: string) => (transparent: boolean = false) => async () => {
    const mindmapContainer = document.querySelector('.mindmap-wrapper');
    if (!mindmapContainer) return;

    const mindmapWrapper = mindmapContainer;
    const backgroundColor = transparent ? 'transparent' : 'white';
    const dataURL = await conversionFn(
        mindmapWrapper,
        { bgcolor: backgroundColor, scale: 2 }
    );
    downloadString(dataURL, filename);
}

export const exportClickPNG = convertAndDownload(domtoimage.toPng, 'mindmap.png');
// Below is very slow, but has accurate text rendering - maybe make optional?
export const exportClickSVGSlow = convertAndDownload(domtoimage.toSvg, 'mindmap.svg');
