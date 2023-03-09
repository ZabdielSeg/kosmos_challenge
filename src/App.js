import React, { useRef, useState, useEffect } from "react";
import Moveable from "react-moveable";
import Component from "./components/Component";

const App = () => {
  const [moveableComponents, setMoveableComponents] = useState([]);
  const [selected, setSelected] = useState(null);
  const [backgroundImages, setBackgroundImages] = useState([]);
  useEffect(() => {
    fetchImages()
  }, [])

  const fetchImages = () => {
    fetch('https://jsonplaceholder.typicode.com/photos')
      .then(response => response.json())
      .then(data => {
        const getOnlyImagesUrl = data.map(info => info.url)
        setBackgroundImages(getOnlyImagesUrl)
      })
      .catch(err => console.log(err))
  }
  const addMoveable = () => {
    // Create a new moveable component and add it to the array
    const BACKGROUNDSIZES = ["cover", "contain", "initial", "auto", "revert"];

    setMoveableComponents([
      ...moveableComponents,
      {
        id: Math.floor(Math.random() * Date.now()),
        top: 0,
        left: 0,
        width: 100,
        height: 100,
        backgroundSize: BACKGROUNDSIZES[Math.floor(Math.random() * BACKGROUNDSIZES.length)],
        updateEnd: true
      },
    ]);
  };

  const updateMoveable = (id, newComponent, updateEnd = false) => {
    const updatedMoveables = moveableComponents.map((moveable, i) => {
      if (moveable.id === id) {
        return { id, ...newComponent, updateEnd };
      }
      return moveable;
    });
    setMoveableComponents(updatedMoveables);
  };

  const deleteMoveable = (id) => {
    const removeComponentById = moveableComponents.filter(component => component.id != id);
    setMoveableComponents(removeComponentById)
  }

  const handleResizeStart = (index, e) => {
    console.log("e", e.direction);
    // Check if the resize is coming from the left handle
    const [handlePosX, handlePosY] = e.direction;
    // 0 => center
    // -1 => top or left
    // 1 => bottom or right

    // -1, -1
    // -1, 0
    // -1, 1
    if (handlePosX === -1) {
      console.log("width", moveableComponents, e);
      // Save the initial left and width values of the moveable component
      const initialLeft = e.left;
      const initialWidth = e.width;

      // Set up the onResize event handler to update the left value based on the change in width
    }
  };

  return (
    <main style={{ height : "100vh", width: "100vw" }}>
      <button onClick={addMoveable}>Add Moveable1</button>
      <div
        id="parent"
        style={{
          position: "relative",
          background: "black",
          height: "80vh",
          width: "80vw",
        }}
      >
        {moveableComponents.map((item, index) => (
          <Component
            {...item}
            index={index}
            key={index}
            updateMoveable={updateMoveable}
            handleResizeStart={handleResizeStart}
            setSelected={setSelected}
            deleteMoveable={deleteMoveable}
            isSelected={selected === item.id}
            backgroundImages={backgroundImages}
          />
        ))}
      </div>
    </main>
  );
};

export default App;