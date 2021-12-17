
import { Markmap } from 'markmap-view';
import { INode } from 'markmap-common';

// The circle between columns counts as one
// so we must remove two
const ONE_MARKMAP_LEVEL = 2;

function maxVisibleBranchDepth(child: INode): number {
    const depth = child.d || -1;
    const hiddenChildren = child?.p?.f === true;

    if (!hiddenChildren && child?.c?.length) {
        const childValues = child.c.flatMap(maxVisibleBranchDepth)
        return Math.max(...childValues);
    }

    return depth;
}

const markChildrenAsHidden = (depthCutoff: number) => (child: INode) => {
    if (child.d && child.d >= depthCutoff) {
        child.p.f = true;
    }
};

const markChildrenAsVisible = (depthCutoff: number) => (child: INode) => {
    if (child?.d === depthCutoff) {
        child.p.f = false;
    }
};

function modifyChildVisibility(node: INode, modifyNode: Function): void {
    modifyNode(node);

    node.c?.forEach(child => {
        modifyChildVisibility(child, modifyNode);
    })
}

export class CustomMarkmap extends Markmap {
    collapseTree() {
        if (!this.state.data) return;

        const maxLevel = maxVisibleBranchDepth(this.state.data);
        const modifyNode = markChildrenAsHidden(maxLevel - ONE_MARKMAP_LEVEL);
        modifyChildVisibility(this.state.data, modifyNode);

        this.renderData();
    }
    expandTree() {
        if (!this.state.data) return;

        const maxLevel = maxVisibleBranchDepth(this.state.data);
        const modifyNode = markChildrenAsVisible(maxLevel);
        modifyChildVisibility(this.state.data, modifyNode);

        this.renderData();
    }
}
