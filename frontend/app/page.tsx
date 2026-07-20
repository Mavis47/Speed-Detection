'use client'

import { useEffect, useRef, useState } from "react";
import { Stage, Layer, Line } from "react-konva";

type LineROI = {
  type: string;
  points: number[];
};

export default function Home() {
  const [isOpenModal, setOpenModal] = useState(false);
  const [modalType, setModalType] = useState<"video" | "rtsp" | null>(null);

  const [sourceType, setSourceType] = useState<"video" | "rtsp" | null>(null);
  const [source, setSource] = useState<string | null>(null);
  const [time, setTime] = useState(Date.now());

  const [rtspUrl, setRtspUrl] = useState("");
  const [lines, setLines] = useState<LineROI[]>([]);
  const [drawing, setDrawing] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);

  const [stageSize, setStageSize] = useState({
    width: 0,
    height: 0,
  });

  const [selectedTool, setSelectedTool] = useState<"red-line" | "blue-line" | null>(null);

  useEffect(() => {
    const id = setInterval(() => {
      setTime(Date.now());
    }, 1000);

    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        setStageSize({
          width: containerRef.current.clientWidth,
          height: containerRef.current.clientHeight,
        });
      }
    };

    updateSize();

    window.addEventListener("resize", updateSize);

    return () => window.removeEventListener("resize", updateSize);
  }, []);

  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;

    const url = URL.createObjectURL(file);

    setSource(url);
    setSourceType("video");
    setOpenModal(false);
  };

  const handleRtsp = () => {
    if (!rtspUrl.trim()) return;

    setSource(rtspUrl);
    setSourceType("rtsp");
    setOpenModal(false);
  };

  const handleMouseDown = (e: any) => {
    if (!selectedTool) return;

    const pos = e.target.getStage().getPointerPosition();

    setLines([...lines, { type: selectedTool, points: [pos.x, pos.y, pos.x, pos.y] }]);

    setDrawing(true);
  };

  const handleMouseMove = (e: any) => {
    if (!drawing || !selectedTool) return;

    const stage = e.target.getStage();
    const point = stage.getPointerPosition();

    const copy = [...lines];

    copy[copy.length - 1] = {
      ...copy[copy.length - 1],
      points: [
        copy[copy.length - 1].points[0],
        copy[copy.length - 1].points[1],
        point.x,
        point.y,
      ],
    };

    setLines(copy);
  };

  const handleMouseUp = () => {
    setDrawing(false);
    setSelectedTool(null);
  };

  const handleSave = async () => {
    await fetch("/api/save-roi", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(lines),
    });
    alert("Roi Saved")
  }

  return (
    <div>
      {/* Top Buttons */}
      <div className="flex justify-center gap-2 p-4 m-3">
        <button
          className="rounded border-2 text-black bg-blue-300 w-32 h-8 cursor-pointer"
          onClick={() => {
            setModalType("video");
            setOpenModal(true);
          }}
        >
          Import Video
        </button>

        <button
          className="rounded border-2 text-black bg-blue-300 w-32 h-8 cursor-pointer"
          onClick={() => {
            setModalType("rtsp");
            setOpenModal(true);
          }}
        >
          Enter RTSP
        </button>

        <button className="rounded border-2 text-black bg-blue-300 w-32 h-8 cursor-pointer">
          Live Demo
        </button>
      </div>

      {/* Main Layout */}
      <div className="flex">

        {/* Video Area */}
        <div ref={containerRef} className="relative rounded border-2 w-[77vw] h-[78vh] m-7 bg-black overflow-hidden" style={{
          width: 1280,
          height: 720,
        }}>

          {/* Video */}
          {sourceType === "video" && source && (
            <video
              src={source}
              controls
              autoPlay
              className="absolute inset-0 w-full h-full object-contain"
            />
          )}

          {/* Snapshot */}
          {sourceType === "rtsp" && (
            <img
              src={`/api/snapshot?t=${time}`}
              className="absolute inset-0 w-full h-full object-contain"
              alt="Camera"
            />
          )}

          {!sourceType && (
            <div className="absolute inset-0 flex items-center justify-center">
              <p className="text-gray-400 text-xl">
                No Source Selected
              </p>
            </div>
          )}

          <Stage width={1280} height={720}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
          >
            <Layer>

              {lines.map((line, index) => (
                <Line
                  key={index}
                  points={line.points}
                  stroke={line.type === "red-line" ? "red" : "blue"}
                  strokeWidth={3}
                />
              ))}

            </Layer>
          </Stage>

        </div>

        {/* Toolbox */}
        <div className="rounded w-56 h-[78vh] border-2 mt-7 mr-5">
          <h1 className="text-center text-2xl mt-3">
            Toolbox
          </h1>

          <div className="m-5">
            <button
              onClick={() => setSelectedTool("red-line")}
              className="border rounded w-full h-10 bg-orange-500 cursor-pointer"
            >
              Red Line
            </button>

            <button
              onClick={() => setSelectedTool("blue-line")}
              className="border rounded w-full h-10 mt-2 bg-blue-300 cursor-pointer"
            >
              Blue Line
            </button>

            <button
              onClick={handleSave}
              className="border rounded w-full h-10 mt-2 cursor-pointer"
            >
              Submit
            </button>

          </div>
        </div>
      </div>

      {/* Modal */}
      {isOpenModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/60 z-50">

          <div className="bg-white rounded-lg p-6 w-96">

            <h2 className="text-xl font-semibold mb-5 text-black">
              {modalType === "video"
                ? "Import Video"
                : "Enter RTSP URL"}
            </h2>

            {modalType === "video" ? (
              <input
                type="file"
                accept="video/*"
                onChange={handleVideoUpload}
                className="w-full border rounded p-2 text-black"
              />
            ) : (
              <input
                type="text"
                value={rtspUrl}
                onChange={(e) => setRtspUrl(e.target.value)}
                placeholder="rtsp://username:password@ip:554/Streaming/Channels/101"
                className="w-full border rounded p-2 text-black"
              />
            )}

            <div className="flex justify-end gap-2 mt-5">

              <button
                onClick={() => {
                  setOpenModal(false);
                  setModalType(null);
                }}
                className="px-4 py-2 border rounded text-black"
              >
                Cancel
              </button>

              {modalType === "rtsp" && (
                <button
                  onClick={handleRtsp}
                  className="px-4 py-2 bg-blue-500 text-white rounded"
                >
                  Connect
                </button>
              )}
            </div>

          </div>
        </div>
      )}
    </div>
  );
}