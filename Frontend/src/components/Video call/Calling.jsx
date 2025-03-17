import React, { useState, useEffect, useRef } from "react";
import Peer from "simple-peer";
import io from "socket.io-client";

const socket = io("http://localhost:5001");

function Calling() {
  const [me, setMe] = useState("");
  const [stream, setStream] = useState(null);
  const [screenStream, setScreenStream] = useState(null);
  const [receivingCall, setReceivingCall] = useState(false);
  const [caller, setCaller] = useState("");
  const [callerSignal, setCallerSignal] = useState();
  const [callAccepted, setCallAccepted] = useState(false);
  const [idToCall, setIdToCall] = useState("");
  const [isVideoMuted, setIsVideoMuted] = useState(false);
  const [isAudioMuted, setIsAudioMuted] = useState(false);

  const myVideo = useRef();
  const userVideo = useRef();
  const screenVideo = useRef();
  const connectionRef = useRef();

  // Initialize media stream and socket listeners
  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        setStream(stream);
      })
      .catch((err) => {
        console.error("Failed to get media stream:", err);
        alert("Failed to access camera/microphone. Please check your permissions.");
      });

    socket.on("me", (id) => setMe(id));
    socket.on("callUser", (data) => {
      setReceivingCall(true);
      setCaller(data.from);
      setCallerSignal(data.signal);
    });
    socket.on("callAccepted", (signal) => {
      setCallAccepted(true);
      if (connectionRef.current) {
        connectionRef.current.signal(signal);
      }
    });

    return () => {
      socket.off("me");
      socket.off("callUser");
      socket.off("callAccepted");
    };
  }, []);

  // Set local video stream
  useEffect(() => {
    if (stream && myVideo.current) {
      myVideo.current.srcObject = stream;
    }
  }, [stream, myVideo]);

  // Call a user
  const callUser = () => {
    if (!idToCall.trim()) {
      alert("Please enter a valid ID to call.");
      return;
    }

    if (!stream) {
      alert("No media stream available.");
      return;
    }

    const peer = new Peer({
      initiator: true,
      trickle: false,
      stream: stream,
    });

    peer.on("signal", (data) => {
      socket.emit("callUser", {
        userToCall: idToCall,
        signalData: data,
        from: me,
      });
    });

    peer.on("stream", (stream) => {
      if (userVideo.current) {
        userVideo.current.srcObject = stream;
      }
    });

    peer.on("error", (err) => {
      console.error("Peer error in callUser:", err);
    });

    connectionRef.current = peer;
  };

  // Answer an incoming call
  const answerCall = () => {
    if (!stream) {
      alert("No media stream available.");
      return;
    }

    setCallAccepted(true);
    const peer = new Peer({
      initiator: false,
      trickle: false,
      stream: stream,
    });

    peer.on("signal", (data) => {
      socket.emit("answerCall", { signal: data, to: caller });
    });

    peer.on("stream", (stream) => {
      if (userVideo.current) {
        userVideo.current.srcObject = stream;
      }
    });

    peer.on("error", (err) => {
      console.error("Peer error in answerCall:", err);
    });

    peer.signal(callerSignal);
    connectionRef.current = peer;
  };

  // End the call
  const endCall = () => {
    if (connectionRef.current) {
      connectionRef.current.destroy();
    }
    setCallAccepted(false);
    setReceivingCall(false);

    // Stop the screen-sharing stream if active
    if (screenStream) {
      screenStream.getTracks().forEach((track) => track.stop());
      setScreenStream(null);
      if (screenVideo.current) {
        screenVideo.current.srcObject = null;
      }
    }

    // Stop the main media stream
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
      navigator.mediaDevices
        .getUserMedia({ video: true, audio: true })
        .then((newStream) => {
          setStream(newStream);
        })
        .catch((err) => {
          console.error("Failed to restart media stream:", err);
        });
    }

    if (userVideo.current) {
      userVideo.current.srcObject = null;
    }

    // Notify the other user to end the call
    socket.emit("endCall", { to: caller });
  };

  // Share the screen
  const shareScreen = () => {
    navigator.mediaDevices
      .getDisplayMedia({ video: true })
      .then((newScreenStream) => {
        setScreenStream(newScreenStream);
        if (screenVideo.current) {
          screenVideo.current.srcObject = newScreenStream;
        }

        const peer = connectionRef.current;
        if (peer && peer.streams.length > 0) {
          const videoTrack = newScreenStream.getVideoTracks()[0];
          if (videoTrack) {
            peer.replaceTrack(
              peer.streams[0].getVideoTracks()[0],
              videoTrack,
              peer.streams[0]
            );
          }
        }
      })
      .catch((err) => {
        console.error("Failed to share screen:", err);
        alert("Failed to share screen. Please try again.");
      });
  };

  // Stop sharing the screen
  const stopScreenShare = () => {
    if (screenStream) {
      // Stop all tracks in the screen-sharing stream
      screenStream.getTracks().forEach((track) => track.stop());
      setScreenStream(null); // Reset the screen stream state

      // Revert to the original camera stream in the peer connection
      const peer = connectionRef.current;
      if (peer && stream) {
        const videoTrack = stream.getVideoTracks()[0];
        if (videoTrack) {
          peer.replaceTrack(
            peer.streams[0].getVideoTracks()[0],
            videoTrack,
            peer.streams[0]
          );
        }
      }

      // Clear the screen video element
      if (screenVideo.current) {
        screenVideo.current.srcObject = null;
      }
    }
  };

  // Toggle video mute/unmute
  const toggleVideo = () => {
    if (stream) {
      const videoTrack = stream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setIsVideoMuted(!videoTrack.enabled);
      }
    }
  };

  // Toggle audio mute/unmute
  const toggleAudio = () => {
    if (stream) {
      const audioTrack = stream.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setIsAudioMuted(!audioTrack.enabled);
      }
    }
  };

  // Loading state while waiting for media stream
  if (!stream) {
    return <div className="text-center">Loading camera and microphone...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4 text-center">
        Video Calling App
      </h1>

      <div className="flex flex-wrap justify-center gap-4">
        {/* Local Video */}
        <div className="flex flex-col items-center">
          <video
            playsInline
            muted
            ref={myVideo}
            controls
            autoPlay
            className="w-full max-w-[500px] rounded-lg shadow-lg"
          />
          <p className="mt-2 text-center">Your ID: {me}</p>
        </div>

        {/* Remote Video */}
        {callAccepted && (
          <div className="flex flex-col items-center">
            <video
              playsInline
              ref={userVideo}
              autoPlay
              className="w-full max-w-[500px] rounded-lg shadow-lg"
            />
            <p className="mt-2 text-center">Connected User</p>
          </div>
        )}

        {/* Screen Sharing Video */}
        {screenStream && (
          <div className="flex flex-col items-center">
            <video
              playsInline
              ref={screenVideo}
              autoPlay
              className="w-full max-w-[600px] rounded-lg shadow-lg"
            />
            <p className="mt-2 text-center">Screen Sharing</p>
          </div>
        )}
      </div>

      <div className="mt-6 flex flex-col items-center space-y-4">
        {/* Input Field and Call Button */}
        <div>
          <input
            type="text"
            value={idToCall}
            onChange={(e) => setIdToCall(e.target.value)}
            placeholder="Enter ID to call"
            className="border p-2 rounded mr-2"
          />
          <button
            onClick={callUser}
            className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
          >
            Call
          </button>
        </div>

        {/* Incoming Call Notification */}
        {receivingCall && !callAccepted && (
          <div>
            <p>{caller} is calling...</p>
            <button
              onClick={answerCall}
              className="bg-green-500 text-white p-2 rounded hover:bg-green-600 mr-2"
            >
              Answer
            </button>
          </div>
        )}

        {/* Call Controls */}
        {callAccepted && (
          <div className="flex space-x-4">
            <button
              onClick={toggleVideo}
              className={`p-2 rounded ${
                isVideoMuted ? "bg-gray-500" : "bg-blue-500"
              } text-white`}
            >
              {isVideoMuted ? "Unmute Video" : "Mute Video"}
            </button>
            <button
              onClick={toggleAudio}
              className={`p-2 rounded ${
                isAudioMuted ? "bg-gray-500" : "bg-blue-500"
              } text-white`}
            >
              {isAudioMuted ? "Unmute Audio" : "Mute Audio"}
            </button>
            <button
              onClick={shareScreen}
              className="bg-purple-500 text-white p-2 rounded hover:bg-purple-600"
            >
              Share Screen
            </button>
            {screenStream && (
              <button
                onClick={stopScreenShare}
                className="bg-red-500 text-white p-2 rounded hover:bg-red-600"
              >
                Stop Screen Share
              </button>
            )}
            <button
              onClick={endCall}
              className="bg-red-500 text-white p-2 rounded hover:bg-red-600"
            >
              End Call
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Calling;