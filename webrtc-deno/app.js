/**
 * @type {MediaStream}
 */
let localStream;
/**
 * @type {MediaStream}
 */
let remoteStream;
/**
 * @type {RTCPeerConnection}
 */
let pc1;
/**
 * @type {RTCPeerConnection}
 */
let pc2;

(async function() {
    await openUserMedia();
    createPc1();
    createPc2();
    bindListener();
    collectCandidate();
    addTrack();
    await createOffer();
    await createAnser();
})()

async function openUserMedia() {
    const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: false
    });
    localStream = stream;
    remoteStream = new MediaStream();
}

function createPc1() {
    pc1 = new RTCPeerConnection();
}

function addTrack() {
    localStream.getTracks().forEach(track => {
        console.log('pc1 add track')
        pc1.addTrack(track, localStream);
    });
}

function createPc2() {
    pc2 = new RTCPeerConnection();
}

async function createOffer() {
    const offer = await pc1.createOffer();
    console.log('create offer')
    pc1.setLocalDescription(offer);
    pc2.setRemoteDescription(offer);
}

async function createAnser() {
    const answer = await pc2.createAnswer();
    console.log('create answer')
    pc2.setLocalDescription(answer);
    pc1.setRemoteDescription(answer);
}

function collectCandidate() {
    pc1.addEventListener('icecandidate', event => {
        console.log('pc1 candidate')
        if (event.candidate) {
            pc2.addIceCandidate(event.candidate);
        }
    });
    pc2.addEventListener('icecandidate', event => {
        console.log('pc2 candidate')
        if (event.candidate) {
            pc1.addIceCandidate(event.candidate);
        }
    })
}

function bindListener() {
    pc1.addEventListener('track', event => {
        console.log('pc1 track event')
    });
    pc2.addEventListener('track', event => {
        console.log('pc2 track event')
    });
}