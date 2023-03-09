import React, { useRef, useState, useEffect } from "react";
import Moveable from "react-moveable";
import '../styles.css';

const Component = ({
    updateMoveable,
    deleteMoveable,
    top,
    left,
    width,
    height,
    index,
    backgroundSize,
    id,
    setSelected,
    isSelected = false,
    backgroundImages,
    updateEnd,
}) => {
    const ref = useRef();

    const [nodoReferencia, setNodoReferencia] = useState({
        top,
        left,
        width,
        height,
        index,
        backgroundSize,
        backgroundImage: `url(${backgroundImages[index]})`,
        id,
    });

    // OJO AQUÍ
    let parent = document.getElementById("parent");
    let parentBounds = parent?.getBoundingClientRect();

    const onResize = async (e) => {
        // ACTUALIZAR ALTO Y ANCHO
        let newWidth = e.width;
        let newHeight = e.height;

        const positionMaxTop = top + newHeight;
        const positionMaxLeft = parentBounds.x + 10;

        // console.log({ e, parentBounds })
        // console.log(parentBounds.x > e.clientX);

        if (parentBounds.x + 1 > e.clientX) {
            updateMoveable(id, {
                top,
                left: parentBounds.x + width,
                width: newWidth,
                height: newHeight,
                backgroundSize,
                backgroundImage: `url(${backgroundImages[index]})`
            });
            return;
        }

        // if (positionMaxTop > parentBounds?.height)
        //     newHeight = parentBounds?.height - top;
        // if (positionMaxLeft > parentBounds?.width)
        //     newWidth = parentBounds?.width - left;

        updateMoveable(id, {
            top,
            left,
            width: newWidth,
            height: newHeight,
            backgroundSize,
            backgroundImage: `url(${backgroundImages[index]})`
        }, true);

        // ACTUALIZAR NODO REFERENCIA
        const beforeTranslate = e.drag.beforeTranslate;

        ref.current.style.width = `${e.width}px`;
        ref.current.style.height = `${e.height}px`;

        let translateX = beforeTranslate[0];
        let translateY = beforeTranslate[1];

        ref.current.style.transform = `translate(${translateX}px, ${translateY}px)`;

        setNodoReferencia({
            ...nodoReferencia,
            translateX,
            translateY,
            top: top + translateY < 0 ? 0 : top + translateY,
            left: left + translateX < 0 ? 0 : left + translateX,
        });
    };

    const onDrag = e => {
        if (parentBounds.x + 1 > e.clientX - width ) {
            updateMoveable(id, {
                top,
                left: parentBounds.x,
                width,
                height,
                backgroundSize,
                backgroundImage: `url(${backgroundImages[index]})`
            });
            return
        } else if (parentBounds.right < e.clientX + width) {
            updateMoveable(id, {
                top,
                left: parentBounds.right - width - 10,
                width,
                height,
                backgroundSize,
                backgroundImage: `url(${backgroundImages[index]})`
            });
            return
        } else if (parentBounds.y > e.clientY - height) {
            updateMoveable(id, {
                top: parentBounds.y,
                left,
                width,
                height,
                backgroundSize,
                backgroundImage: `url(${backgroundImages[index]})`
            });
            return
        } else if (parentBounds.bottom < e.clientY + height) {
            updateMoveable(id, {
                top: parentBounds.bottom - height - 20,
                left,
                width,
                height,
                backgroundSize,
                backgroundImage: `url(${backgroundImages[index]})`
            });
            return
        }
        updateMoveable(id, {
            top: e.top,
            left: e.left,
            width,
            height,
            backgroundSize,
            backgroundImage: `url(${backgroundImages[index]})`
        });
    }

    return (
        <>
            <div
                ref={ref}
                className="draggable"
                id={"component-" + id}
                style={{
                    position: "absolute",
                    top: top,
                    left: left,
                    width: width,
                    height: height,
                    backgroundSize: backgroundSize,
                    backgroundImage: `url(${backgroundImages[index]})`
                }}
                onClick={() => setSelected(id)}
            />


            <button onClick={() => deleteMoveable(id)} style={{ position: 'relative', top: top, left: left }}>Delete</button>

            <Moveable
                target={isSelected && ref.current}
                resizable
                draggable
                onDrag={onDrag}
                onResize={onResize}
                // onResizeEnd={onResizeEnd}
                // onResizeStart={handleResizeStart}
                keepRatio={false}
                throttleResize={1}
                renderDirections={["nw", "n", "ne", "w", "e", "sw", "s", "se"]}
                edge={false}
                zoom={1}
                origin={false}
                padding={{ left: 0, top: 0, right: 0, bottom: 0 }}
                clientE
            />
        </>
    );
};

export default Component