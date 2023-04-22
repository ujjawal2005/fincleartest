import React, { useRef, useEffect,useState, useCallback } from 'react';
import { useSpring, animated } from 'react-spring';
import styled from 'styled-components';
import { MdClose } from 'react-icons/md';
import axios from "axios";
import { CustomDropdown } from './CustomDropdown';
import '../styles/sharesstyle.css';

const Background = styled.div`
  width: 100%;
  height: 100%;
//   background: rgba(0, 0, 0, 0.8);
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ModalWrapper = styled.div`
  width: 800px;
  height: 400px;
  box-shadow: 0 5px 16px rgba(0, 0, 0, 0.2);
  background: #fff;
  color: #000;
  display: grid;
  grid-template-columns: 1fr 1fr;
  position: relative;
  z-index: 10;
  border-radius: 10px;
`;

const ModalImg = styled.img`
  width: 100%;
  height: 100%;
  border-radius: 10px 0 0 10px;
  background: #000;
`;

const ModalContent = styled.div`
  display: flex;
  width: 800px;
  text-align:left;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  line-height: 1.8;
  color: #141414;

  p {
    margin-bottom: 1rem;
  }

  button {
    padding: 10px 24px;
    background: #141414;
    color: #fff;
    border: none;
  }
`;

const CloseModalButton = styled(MdClose)`
  cursor: pointer;
  position: absolute;
  top: 20px;
  right: 20px;
  width: 32px;
  height: 32px;
  padding: 0;
  z-index: 10;
`;


export const BuyModal = ({ showModal, setShowModal }) => {
  const modalRef = useRef();

  const animation = useSpring({
    config: {
      duration: 250
    },
    opacity: showModal ? 1 : 0,
    transform: showModal ? `translateY(0%)` : `translateY(-100%)`
  });

  const closeModal = e => {
    if (modalRef.current === e.target) {
      setShowModal(false);
    }
  };

  const keyPress = useCallback(
    e => {
      if (e.key === 'Escape' && showModal) {
        setShowModal(false);
        console.log('I pressed');
      }
    },
    [setShowModal, showModal]
  );

  useEffect(
    () => {
      document.addEventListener('keydown', keyPress);
      return () => document.removeEventListener('keydown', keyPress);
    },
    [keyPress]
  );

  const [volume, setVolume] = useState([
]);
const [num, setNum] = useState(0);
const [code, setCode] = useState('');
const [volData, setVolData] = useState(0);
    const onChange = (event) => {
        setCode(event.target.value);
        axios.get(url + 'volumes')
            .then((response) =>setVolume(response.data))
            .catch((err) => console.log(err));
        setVolData(0);
         volume.filter((vol) => vol.code === event.target.value)
            .map((shareMap) => setVolData(shareMap.volume));
    }
  const [sharesList, setSharesList] = useState([]);

    let url = 'http://localhost:3010/';
    const listShare = (() => {
        console.log("inside BuyModal:");
        if(!(sharesList.length > 0)){
            axios.get(url + 'shares')
            .then((response) => setSharesList(response.data))
            .catch((err) => console.log(err));
        }
    });

    useEffect(() => {
     listShare();
    }, [sharesList]);

    const buyShare = () => {
        let volData= {};
        volData = volume.filter((volume) => volume.code === code);
        volData[0].volume = volData[0].volume - num;
        // let volume = 0;
        // volume = volData[0].volume;
        axios.put(url + 'volumes/'+volData[0].id,{"volume":volData[0].volume,"code": code})
            .then((response) =>setVolData(volData[0].volume))
            .catch((err) => console.log(err));
            // setShowModal(prev => !prev);
    }
    

  return (
    <>
      {showModal ? (
        <Background onClick={closeModal} ref={modalRef}>
          <animated.div style={animation}>
            <ModalWrapper showModal={showModal}>
              {/* <ModalImg src={require('./modal.jpg')} alt='camera' /> */}
              <ModalContent>
                <h3>Are you ready to buy shares?</h3>
                
                <h2>Select the company : <CustomDropdown
                                        name={code}
                                        options={sharesList}
                                        onChange={onChange}
                                        />
                </h2> 
                <>
                <div className='buyText'>
                  <table>
                    <tr>
                      <td>
                      Available Shares is {volData} 
                      </td>
                    </tr>
                    <tr>
                      <td>
                      Enter the number of share you want to buy: <input onChange={(event) => setNum(event.target.value)} type="number" placeholder='Enter the number of shares..'/>
                      </td>
                    </tr>
                  </table>
                
               
                </div>
                </>
                <button onClick={buyShare}>Buy</button>
              </ModalContent>
              <CloseModalButton
                aria-label='Close modal'
                onClick={() => setShowModal(prev => !prev)}
              />
            </ModalWrapper>
          </animated.div>
        </Background>
      ) : null}
    </>
  );
};