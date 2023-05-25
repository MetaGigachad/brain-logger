import handleViewport from 'react-in-viewport';

function LoaderBase(props) {
  const { inViewport, forwardedRef } = props;
  return <div className="loader" ref={forwardedRef}></div>;
}

export const Loader = handleViewport(LoaderBase, {});
