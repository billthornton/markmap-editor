/**
 * From https://tabler-icons.io/i/zoom-out
 * Needs https://github.com/tabler/tabler-icons/pull/148/files merging and releasing 
 * before it can be deleted
 */
export const IconZoomOut = ({ size }: { size: number | string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-zoom-out" width={size} height={size} viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
        <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
        <circle cx={10} cy={10} r={7}></circle>
        <line x1={7} y1={10} x2={13} y2={10}></line>
        <line x1={21} y1={21} x2={15} y2={15}></line>
    </svg>
);
