import React, { useLayoutEffect, useState } from 'react'
import calcBoundingBoxes from '../helpers/calcBoundingBoxes';
import usePrevious from '../hooks/usePrevious';

const AnimateCards = ({ children }) => {
 const [boundingBox, setBoundingBox] = useState({});
 const [prevBoundingBox, setPrevBoundingBox] = useState({});
 const prevChildren = usePrevious(children);

 useLayoutEffect(() => {
  const newBoundingBox = calcBoundingBoxes(children);
  setBoundingBox(newBoundingBox);
 }, [children]);

 useLayoutEffect(() => {
  const prevBoundingBox = calcBoundingBoxes(prevChildren);
  setPrevBoundingBox(prevBoundingBox);
 }, [prevChildren]);

 useLayoutEffect(() => {
  const hasPrevBoundingBox = Object.keys(prevBoundingBox).length;

  if (hasPrevBoundingBox) {
   React.Children.forEach(children, child => {
    const domNode = child.ref.current;
    const oldBox = prevBoundingBox[child.key];
    const newBox = boundingBox[child.key];
    const deltaX = oldBox.left - newBox.left;

    if (deltaX) {
     requestAnimationFrame(() => {
      domNode.style.transform = `translateX(${deltaX}px)`;
      domNode.style.transition = "transform 0s";

      requestAnimationFrame(() => {
       domNode.style.transform = "";
       domNode.style.transition = "transform 500ms";
      });
     })
    }
   })
  }
 }, [boundingBox, prevBoundingBox, children]);

 return (
  <div>{children}</div>
 )
}

export default AnimateCards