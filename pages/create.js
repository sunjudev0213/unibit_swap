
// Material
import {
    Box,
    Container,
    Toolbar,
    Select,
    MenuItem,
    Stack,
    TextField,
    Tooltip,
    Card,
    Button,
    Input,
    Icon,
    Typography,
    FormControl,
    RadioGroup,
    FormControlLabel,
    Radio 
} from '@mui/material';

// Context
import { useContext } from 'react';
import { AppContext } from 'src/AppContext';

// Components
import Header from 'src/components/Header';
import ScrollToTop from 'src/components/ScrollToTop';

import { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux'
import React from 'react';
import Page from 'src/components/Page';
import styled from 'styled-components';
import { useRouter } from 'next/router'
import ImageIcon from '@mui/icons-material/Image';
import { LoadingButton } from '@mui/lab';
import SendIcon from '@mui/icons-material/Send';
import CloseIcon from '@mui/icons-material/Close';
import IconButton from '@mui/material/IconButton';
import axios from 'axios'
import FormData from 'form-data';
import XSnackbar from 'src/components/Snackbar';
import { useSnackbar } from 'src/components/useSnackbar';
import { Modal } from "react-bootstrap";

import { useWeb3React } from "@web3-react/core";

// overflow: scroll;
// overflow: auto;
// overflow: hidden;

const OverviewWrapper = styled(Box)(
    ({ theme }) => `
        // overflow: hidden;
        flex: 1;
`
);

const BackgroundWrapper = styled(Box)(
    ({ theme }) => `
        width: 100%;
        height: 90%;
        position: absolute;
        background-size: cover;
        background-color: rgb(32, 34, 37);
        background-position: center center;
        opacity: 0.99;
        z-index: -1;
        filter: blur(8px);
        -webkit-mask: linear-gradient(rgb(255, 255, 255), transparent);
`
);

export default function Swap({}) {
    const { darkMode, openSnackbar } = useContext(AppContext);
    
    return (
        <OverviewWrapper>
            <Toolbar id="back-to-top-anchor" />

            <BackgroundWrapper
                style={{
                    backgroundImage: `url(/static/background.png)`,
                    opacity: `${darkMode?0.5:0.7}`
                }}
            />

            <Header />

            <Container maxWidth="lg">
                <Create />
            </Container>

            <ScrollToTop />

        </OverviewWrapper>
    );
}

function Create(){
  const router = useRouter()
  const [tokenName, setTokenName] = useState('')
  const [price, setPrice] = useState('')
  const [description, setDescription] = useState('')
  const { isOpen, msg, variant, openSnackbar, closeSnackbar } = useSnackbar()
  const fileRef = useRef();
  const [fileUrl, setFileUrl] = useState(null)
  const [file, setFile] = useState(null)
  const [loading, setLoading] = useState(false)
  const [tokenid, setTokenid] = useState(null)
  const [tokenuri, setTokenuri] = useState(null)
  const [codeType, setCodeType] = useState('Template');
  const create_url = "http://135.181.234.78/api/upload"
  const { account, active, library, chainId } = useWeb3React();

  const [show, setShow] = useState({
    show: false,
    title: "",
    link: "",
    progress: false,
    dismiss: false,
    buttonText: "",
  });
  const handleClose = () => setShow(false);
  function showMintModal(state, title, link, progress, dismiss, buttonText) {
    setShow({
      show: state,
      title,
      link,
      progress,
      dismiss,
      buttonText,
    });
  }

  const handleFileSelect = (e) => {
      const pickedFile = e.target.files[0]

      const reader = new FileReader()
      if (pickedFile) {
          setFile(pickedFile)

          // This is used as src of image
          reader.readAsDataURL(pickedFile)
          reader.onloadend = function (e) {
              setFileUrl(reader.result)
          }
      }
  }

  const uploadfile = async () => {

      // TODO: Called only when the file is uploaded to site.
      if (!tokenName || !description || !price || !fileUrl) {
        openSnackbar('Please fillout data', 'error')
        return
      }
      setLoading(true)
      if (file) {
          try {
              const formData = new FormData()
              formData.append("file", file)
              formData.append("name", tokenName)
              formData.append("description", description)
              console.log('uploading image to ipfs')
              const response = await axios.post(
                  create_url,
                  formData
              )
              if(response.result === 'success'){
                openSnackbar('NFT uploading success')
                setTokenuri(response.data)
              }
              else{
                openSnackbar('NFT uploading failed', 'error')
              }
          } catch (e) {
              console.log(e)
              openSnackbar(e.message, 'error')
          }
      }
      setLoading(false)
  }

  const handleResetFile = (e) => {
      e.stopPropagation()
      setFileUrl(null)
      fileRef.current.value = null
  }

  const NFTUploader = () => {
    return(
      <CardWrapper>
          <input
              ref={fileRef}
              style={{ display: 'none' }}
              // accept='image/*,video/*,audio/*,webgl/*,.glb,.gltf'
              accept='all/*'
              id='contained-button-file'
              multiple
              type='file'
              onChange={handleFileSelect}
          />
          <Card
              sx={{
                  display: 'flex',
                  width: 200,
                  height: 120,
                  justifyContent: 'center',
                  alignItems: 'center',
                  overflow: 'auto',
                  position: 'relative'
              }}
          >
              <CardOverlay
                  onClick={() => fileRef.current.click()}
              >
                  <IconButton
                      aria-label='close' onClick={(e) => handleResetFile(e)}
                      sx={fileUrl ? { position: 'absolute', right: '1vw', top: '1vh' } : { display: 'none' }}
                  >
                      <CloseIcon color='white' />
                  </IconButton>
              </CardOverlay>
              <img src={fileUrl} alt='' style={fileUrl ? {objectFit:'cover', height: '100%', overflow:'hidden'} : { display: 'none' }} />
              <ImageIcon fontSize='large' sx={fileUrl ? { display: 'none' } : {width: 100, height: 100}} />
          </Card>
          <Stack>
              <LoadingButton
                  loading={loading}
                  loadingPosition='start'
                  startIcon={<SendIcon />}
                  onClick={uploadfile}
              >
                  Upload
              </LoadingButton>
          </Stack>
          <XSnackbar isOpen={isOpen} message={msg} variant={variant} close={closeSnackbar} />
      </CardWrapper>
    )
  }

  return (
    <Page title='Create - NFT'>
      <Container maxWidth='md' sx={{ marginBottom: '3vh' }}>
        
        <Stack spacing={2} marginBottom={3} marginTop={3}>
          <Typography variant="h4" >
            Create New BRC20 Token
          </Typography>
          <Typography variant='caption'>Name</Typography>
          <TextField required placeholder='Token Name' margin='dense'
            onChange={(e) => {
              setTokenName(e.target.value)
            }}
            value={tokenName}
            sx={{
              '&.MuiTextField-root': {
                marginTop: 1
              }
            }} />
        </Stack>
        <Stack spacing={2} marginBottom={3}>
          <Typography variant='caption'>Symbol</Typography>
          <TextField
            required placeholder='Token Symbol'
            margin='dense'
            onChange={(e) => {
              setPrice(e.target.value)
            }}
            value={price}
            sx={{
              '&.MuiTextField-root': {
                marginTop: 1
              }
            }} />
        </Stack>
        <FormControl>
          <RadioGroup
            row
            aria-labelledby="demo-row-radio-buttons-group-label"
            name="row-radio-buttons-group"
            value={codeType}
            onChange={(e) => {setCodeType(e.target.value)}}
          >
            <FormControlLabel value="Template" control={<Radio />} label="Template" />
            <FormControlLabel value="Customize" control={<Radio />} label="Customized code" />
          </RadioGroup>
        </FormControl>

        { codeType == "Customize" &&
          <>
            <Stack spacing={2} marginBottom={3} marginTop={2}>
              <Typography variant='caption' >Contract code</Typography>
              <TextField
                placeholder='Provide a customized contract code'
                margin='dense'
                multiline
                maxRows={4}
                value={description}
                onChange={(e) => {
                  setDescription(e.target.value)
                }}
                sx={{
                  '&.MuiTextField-root': {
                    marginTop: 1,
                    minHeight: 10
                  },
                  '& .MuiOutlinedInput-root': {
                    height: 100,
                    alignItems: 'start'
                  }
                }} />
            </Stack>
            
            <Stack spacing={2} marginBottom={3}>
              
              <Typography variant='caption'>
                Token Contract files
              </Typography>
              <NFTUploader />
            </Stack>
          </>
        }
        <Stack spacing={2} marginBottom={3} marginTop={3} direction="row">
          <Button
            sx={{ padding: 1, width:'35%' }}
            // onClick={() => mintNFT(tokenuri)}
            variant='contained'
          >
            Create
          </Button>
          <Button
            sx={{ padding: 1, width:'35%' }}
            onClick={() => listNFT(tokenid)}
            variant='contained'
          >
            List Token
          </Button>
        </Stack>
      </Container>
      <div className="mintmodalcontainer">
        <Modal show={show.show} onHide={handleClose} className="mymodal">
          <Modal.Body>
            <div className="mintmodal">
              <img
                src="/success.png"
                className="mintmodalimage"
                alt="Mintmodalimage"
              />

              <h2>{show.title}</h2>
              <h3>
                See the transaction on
                <a href={show.link} target="_blank" rel="noreferrer">
                  {" "}
                  Matle Explorer
                </a>
              </h3>
              {show.progress && (
                <div className="spinner-border text-primary" role="status">
                  <span className="sr-only"></span>
                </div>
              )}
              <h3>{show.body}</h3>

              {show.dismiss && (
                <button className="btn herobtn" onClick={handleClose}>
                  {show.buttonText}
                </button>
              )}
            </div>
          </Modal.Body>
        </Modal>
      </div>
    </Page >
  );
}
const CardWrapper = styled.div`
    border: dashed 3px;
    border-radius: 5px;
    padding: 5px;
    width: fit-content;
    &:hover {
        cursor: pointer;
    }
`

const CardOverlay = styled.div`
display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: absolute;
  background: black;
  inset: 0;
  opacity: 0;
  z-index: 1;
  transition: opacity 0.5s;
  &:hover {
    opacity: 0.6;
  }
  }
`