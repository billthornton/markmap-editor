
import { Markmap } from 'markmap-view';
import { INode } from 'markmap-common';
import { IMarkmapFlexTreeItem } from 'markmap-view/types/types';

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

const markAllChildrenAsVisible = (child: INode) => {
    if (child?.d) {
        child.p.f = false;
    }
};

const markAllChildrenAsHidden = (child: INode) => {
    if (child?.d) {
        child.p.f = true;
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
    handleClick(event: any, d: IMarkmapFlexTreeItem) {
        const shouldExpandWholeTree = event.shiftKey;
        const shouldExpandAdjacentTree = event.altKey;

        const node = d.data;
        const hiddenChildren = node?.p?.f === true;

        if (shouldExpandWholeTree) {
            const modifyNode = hiddenChildren ? markAllChildrenAsVisible : markAllChildrenAsHidden;
            modifyChildVisibility(node, modifyNode);
        } else if (shouldExpandAdjacentTree) {
            const maxLevel = node.d || -1;
            const modifyNode = hiddenChildren ? markChildrenAsVisible(maxLevel) : markChildrenAsHidden(maxLevel);
            modifyChildVisibility(d.parent.data, modifyNode);
        } else {
            node.p = {
                ...node.p,
                f: !hiddenChildren,
            };
        }

        this.renderData(node);
    }
}
