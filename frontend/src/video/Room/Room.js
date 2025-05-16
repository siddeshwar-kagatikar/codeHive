      import React,{ useContext, useRef, useCallback, useState, useEffect} from 'react'
      import "./Room.css";
      import { useParams, useLocation, useNavigate } from "react-router-dom";
      import { ZegoUIKitPrebuilt } from "@zegocloud/zego-uikit-prebuilt";
      import { APP_ID, SECRET } from "../../Config";
import EditorContainer from "../../codeEditor/EditorContainer";
import { makeSubmission } from '../../codeEditor/service';

      function Room() {
        const { roomId } = useParams();
        const location = useLocation();
        const navigate = useNavigate();
        const zpRef = useRef(null);
        const videoContainerRef = useRef(null);
        const [joined, setJoined] = useState(false);
        const [callType, setCallType] = useState(""); // State to store the call type

        // Initialize ZegoUIKit and join room
        const myMeeting = (type) => {
          const appID = APP_ID;
          const serverSecret = SECRET;
          const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
            appID,
            serverSecret,
            roomId,
            Date.now().toString(),
            "Your Name"
          );

          const zp = ZegoUIKitPrebuilt.create(kitToken);
          zpRef.current = zp;

          zp.joinRoom({
            container: videoContainerRef.current,
            sharedLinks: [
              {
                name: "Video Call Link",
                url:
                  window.location.protocol +
                  "//" +
                  window.location.host +
                  "/room/" +
                  roomId +
                  "?type=" +
                  encodeURIComponent(type),
              },
            ],
            scenario: {
              mode:
                type === "one-on-one"
                  ? ZegoUIKitPrebuilt.OneONoneCall
                  : ZegoUIKitPrebuilt.GroupCall,
            },
            maxUsers: type === "one-on-one" ? 2 : 10,
            onJoinRoom: () => {
              setJoined(true);
            },
            onLeaveRoom: () => {
              navigate("/meeting"); // Navigate back to /meeting
            },
          });
        };

        // Handle exit from the room manually
        const handleExit = () => {
          if (zpRef.current) {
            zpRef.current.destroy();
          }
          navigate("/meeting"); // Navigate back to /meeting
        };

        // On component mount, extract call type from URL query and initialize meeting
        useEffect(() => {
          const query = new URLSearchParams(location.search);
          const type = query.get("type");

          if (type) {
            setCallType(type); // Update state with call type
          }
        }, [location.search]);

        // Initialize meeting when callType is set
        useEffect(() => {
          if (callType) {
            myMeeting(callType);
          }

          // Cleanup on component unmount
          return () => {
            if (zpRef.current) {
              zpRef.current.destroy();
            }
          };
        }, [callType, roomId, navigate]);

      // part of code editor
        const [input, setInput] = useState('');
        const [output, setOutput] = useState('');
        const [showLoader, setShowLoader] = useState(false);
        const [result, setResult] = useState([]);

        const changeInputText = (e) => {
          setInput(e.target.value);
        }

        const callback = ({apiStatus,data,message}) => {
          if(apiStatus === 'loading'){
            setShowLoader(true);
          }
          else if(apiStatus === 'error'){
            setShowLoader(false);
            setOutput('Something went wrong');
           //  setResult((prevResult) => [...prevResult, 'Fail']);
            // alert(message);
          }
          else{
            //api success
            setShowLoader(false);
            if(data.status.id === 3){
              setOutput(atob(data.stdout));
             //  setResult((prevResult) => [...prevResult, atob(data.stdout)]);
            }
            else{
              setOutput(atob(data.stderr));
             //  setResult((prevResult) => [...prevResult, 'Fail']);
            }
          }
        }

        const submitCode = ()=>{
        }

        const runCode = useCallback(({code,language}) => {
           console.log("input",input);
           makeSubmission({code, language, stdin:input, callback})
         },[input])

        return (
          <div className="playground-container">
            {!joined && (
              <>
                <header className="room-header">
                  {/* {callType === "one-on-one"
                    ? "One-on-One Video Call"
                    : "Group Video Call"} */}
                </header>
              </>
            )}
            <div>
            <div ref={videoContainerRef} className="video-container" />
              <div className="input-output-container">
              <div className="input-section">
                <label>Input</label>
                <textarea value={input} onChange={changeInputText}></textarea>
              </div>
              <div className="output-section">
                <label>Output</label>
                <textarea value={output} readOnly></textarea>
              </div>

            </div>
            </div>
            <div className="editor-panel">
              <EditorContainer runCode={runCode} submitCode={submitCode} roomId={roomId}/>
            </div>
            {showLoader && (
            <div className="loader-container">
              <div className="loader"></div>
            </div>
          )}
          </div>
        );
      }

      export default Room;

