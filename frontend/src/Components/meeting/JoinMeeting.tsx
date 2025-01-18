import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { ZegoUIKitPrebuilt } from '@zegocloud/zego-uikit-prebuilt';
import { useLocation, useNavigate } from 'react-router-dom';
import { X } from 'lucide-react';

interface JoinMeetingProps {
  userName?: string;
  onClose?: () => void;
}

const JoinMeeting: React.FC<JoinMeetingProps> = ({
  userName = "User",
  onClose
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [mounted, setMounted] = useState(false);
  const searchParams = new URLSearchParams(location.search);
  const roomID = searchParams.get('roomID') || '';

  useEffect(() => {
    setMounted(true);
    
    // Lock body scroll when modal is open
    document.body.style.overflow = 'hidden';
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  const generateToken = (roomID: string, userID: string, userName: string) => {
    const appID = Number(import.meta.env.VITE_ZEGO_APP_ID);
    const serverSecret = import.meta.env.VITE_ZEGO_SERVER_SECRET as string;
    
    return ZegoUIKitPrebuilt.generateKitTokenForTest(
      appID,
      serverSecret,
      roomID,
      userID,
      userName
    );
  };

  const handleClose = () => {
    if (onClose) {
      onClose();
    } else {
      navigate(-1);
    }
  };

  const myMeeting = async (element: HTMLDivElement | null) => {
    if (!element) return;
    
    const userID = Math.random().toString(36).substring(7);
    const kitToken = generateToken(roomID, userID, userName);
    const zp = ZegoUIKitPrebuilt.create(kitToken);

    zp.joinRoom({
      container: element,
      sharedLinks: [
        {
          name: 'Meeting Link',
          url: window.location.href
        },
      ],
      scenario: {
        mode: ZegoUIKitPrebuilt.VideoConference,
      },
      showScreenSharingButton: true,
      showUserList: true,
      turnOnMicrophoneWhenJoining: true,
      turnOnCameraWhenJoining: true,
      showMyCameraToggleButton: true,
      showMyMicrophoneToggleButton: true,
      showAudioVideoSettingsButton: true,
      maxUsers: 9,
      layout: "Grid",
      // Using supported configuration options
      showLayoutButton: true,
      showPreJoinView: true,
      showNonVideoUser: true,
      showOnlyAudioUser: true,
      showUserName: true
    });
  };

  const modalContent = (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black">
      {/* Close button - Responsive positioning */}
      <button
        onClick={handleClose}
        className="absolute top-2 right-2 z-50 p-2 bg-gray-800 hover:bg-gray-700 rounded-full text-white 
                 transition-colors duration-200 
                 sm:top-4 sm:right-4 
                 md:top-6 md:right-6 
                 lg:top-8 lg:right-8"
        aria-label="Close meeting"
      >
        <X className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
      </button>

      {/* Meeting container - Responsive sizing */}
      <div
        ref={myMeeting}
        className="w-full h-full 
                   sm:h-[calc(100vh-16px)] sm:w-[calc(100vw-16px)] 
                   md:h-[calc(100vh-32px)] md:w-[calc(100vw-32px)] 
                   lg:h-[calc(100vh-48px)] lg:w-[calc(100vw-48px)] 
                   rounded-none sm:rounded-lg 
                   overflow-hidden"
      />
    </div>
  );

  return mounted ? createPortal(modalContent, document.body) : null;
};

export default JoinMeeting;