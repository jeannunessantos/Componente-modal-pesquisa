import { CloseOutlined, FullscreenExitOutlined, FullscreenOutlined } from '@ant-design/icons';
import { Button, Modal } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import type { DraggableData, DraggableEvent } from 'react-draggable';
import Draggable from 'react-draggable';

interface PbsModalProps {
    title?: React.ReactNode;
    open: boolean;
    onOk?: (...args: any[]) => void;
    onCancel?: (...args: any[]) => void;
    children: React.ReactNode;
    footer?: React.ReactNode[] | Iterable<React.ReactNode>;
    width?: number;
    hideCloseButton?: boolean;
    [key: string]: any;
}

const PbsModal = ({ title, open, onOk, okText, onCancel, cancelText, children, footer, width, hideCloseButton, ...rest }: PbsModalProps) => {
const [isFullScreen, setIsFullScreen] = useState(false);
const [isFullWidth, setIsFullWidth] = useState(false);
const [isFullScreenButtonEnabled, setFullScreenButtonEnabled] = useState(true);
const [draggableDisabled, setDraggableDisabled] = useState(true);
const [bounds, setBounds] = useState({ left: 0, top: 0, bottom: 0, right: 0 });
const draggleRef = useRef<HTMLDivElement>(null);

const onStart = (_event: DraggableEvent, uiData: DraggableData) => {
    const { clientWidth, clientHeight } = window.document.documentElement;
    const targetRect = draggleRef.current?.getBoundingClientRect();
    if (!targetRect) {
      return;
    }
    setBounds({
      left: -targetRect.left + uiData.x,
      right: clientWidth - (targetRect.right - uiData.x),
      top: -targetRect.top + uiData.y,
      bottom: clientHeight - (targetRect.bottom - uiData.y)
    });
  };

  const handleFullScreen = () => {
    setIsFullScreen(!isFullScreen);
  };

  return (
    <Modal
      title={
        <div
          style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'move' }}
          onMouseOver={() => {
            if (draggableDisabled) {
              setDraggableDisabled(false);
            }
          }}
          onMouseOut={() => {
            setDraggableDisabled(true);
          }}
        >
          <div>{title}</div>
          <div>
            {isFullScreenButtonEnabled && (
              <Button
                icon={isFullScreen ? <FullscreenExitOutlined /> : <FullscreenOutlined />}
                onClick={handleFullScreen}
                style={{ border: 'none', background: 'none', boxShadow: 'none' }}
              />
            )}
            {!hideCloseButton && (
              <Button
                icon={<CloseOutlined />}
                onClick={onCancel}
                style={{ border: 'none', background: 'none', boxShadow: 'none', marginRight: '-0.5rem' }}
              />
            )}
          </div>
        </div>
      }
      open={open}
      onOk={onOk}
      onCancel={onCancel}
      closable={false}
      width={isFullScreen || isFullWidth ? '100vw' : width}
      centered
      okText={okText}
      cancelText={cancelText}
      footer={footer !== undefined ? footer : (okText || cancelText) ? undefined : []}
      destroyOnClose
      modalRender={(modal:any) => (
        <Draggable disabled={draggableDisabled} bounds={bounds} nodeRef={draggleRef} onStart={(event, uiData) => onStart(event, uiData)}>
          <div ref={draggleRef}>{modal}</div>
        </Draggable>
      )}
      {...rest}>
      <div style={isFullScreen ? { height: '98vh', maxHeight: 'calc(98vh - 120px)' } : { maxHeight: 'calc(98vh - 120px)' }}>{children}</div>
    </Modal>
)
};
export default PbsModal;