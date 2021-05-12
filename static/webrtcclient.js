'use strict';

// ==========================================================================
// Global variables
// ==========================================================================
var peerConnection; // WebRTC PeerConnection
var dataChannel; // WebRTC DataChannel
var room; // Room name: Caller and Callee have to join the same 'room'.
var socket; // Socket.io connection to the Web server for signaling.

// ==========================================================================
// 1. Make call
// ==========================================================================

// --------------------------------------------------------------------------
// Function call, when call button is clicked.
async function call() {
  // Enable local video stream from camera or screen sharing
  var localStream = await enable_camera();

  // Create Socket.io connection for signaling and add handlers
  // Then start signaling to join a room
  socket = create_signaling_connection();
  add_signaling_handlers(socket);
  call_room(socket);

  // Create peerConneciton and add handlers
  peerConnection = create_peerconnection(localStream);
  add_peerconnection_handlers(peerConnection);
}

// --------------------------------------------------------------------------
// Enable camera
// use getUserMedia or displayMedia (share screen). 
// Then show it on localVideo.
async function enable_camera() {

  // *** TODO ***: define constraints: set video to true, audio to false
  const constraints = {video:true,audio:false};
  // *** TODO ***: uncomment the following log message
  console.log('Getting user media with constraints', constraints);

  // *** TODO ***: use getUserMedia to get a local media stream from the camera.
  //               If this fails, use getDisplayMedia to get a screen sharing stream.
  let stream=null;
  try{
     stream =await navigator.mediaDevices.getUserMedia(constraints);
  }catch(error){
     stream = await navigator.mediaDevices.getDisplayMedia(constraints);
  }
  document.getElementById('localVideo').srcObject = stream;
  return stream;
}

// ==========================================================================
// 2. Signaling connection: create Socket.io connection and connect handlers
// ==========================================================================

// --------------------------------------------------------------------------
// Create a Socket.io connection with the Web server for signaling
function create_signaling_connection() {
  // *** TODO ***: create a socket by simply calling the io() function
  //               provided by the socket.io library (included in index.html).
  // var socket = ...
  return socket;
}

// --------------------------------------------------------------------------
// Connect the message handlers for Socket.io signaling messages
function add_signaling_handlers(socket) {
  // Event handlers for joining a room. Just print console messages
  // --------------------------------------------------------------
  // *** TODO ***: use the 'socket.on' method to create handlers for the 
  //               messages 'created', 'joined', 'full'.
  //               For all three messages, simply write a console log.


  // Event handlers for call establishment signaling messages
  // --------------------------------------------------------
  // *** TODO ***: use the 'socket.on' method to create signaling message handlers:
  // new_peer --> handle_new_peer
  // invite --> handle_invite
  // ok --> handle_ok
  // ice_candidate --> handle_remote_icecandidate
  // bye --> hangUp

}

// --------------------------------------------------------------------------
// Prompt user for room name then send a "join" event to server
function call_room(socket) {
  room = prompt('Enter room name:');
  if (room != '') {
      console.log('Joining room: ' + room);
      // *** TODO ***: send a join message to the server with room as argument.

  }
}

// ==========================================================================
// 3. PeerConnection creation
// ==========================================================================

// --------------------------------------------------------------------------
// Create a new RTCPeerConnection and connect local stream
function create_peerconnection(localStream) {
  const pcConfiguration = {'iceServers': [{'urls': 'stun:stun.l.google.com:19302'}]}

  // *** TODO ***: create a new RTCPeerConnection with this configuration
  //var pc = ...

  // *** TODO ***: add all tracks of the local stream to the peerConnection

  return pc;
}

// --------------------------------------------------------------------------
// Set the event handlers on the peerConnection. 
// This function is called by the call function all on top of the file.
function add_peerconnection_handlers(peerConnection) {

  // *** TODO ***: add event handlers on the peerConnection
  // onicecandidate -> handle_local_icecandidate
  // ontrack -> handle_remote_track
  // ondatachannel -> handle_remote_datachannel
}

// ==========================================================================
// 4. Signaling for peerConnection negotiation
// ==========================================================================

// --------------------------------------------------------------------------
// Handle new peer: another peer has joined the room. I am the Caller.
// Create SDP offer and send it to peer via the server.
async function handle_new_peer(room){
  console.log('Peer has joined room: ' + room + '. I am the Caller.');
  create_datachannel(peerConnection); // MUST BE CALLED BEFORE createOffer

  // *** TODO ***: use createOffer (with await) generate an SDP offer for peerConnection
  // *** TODO ***: use setLocalDescription (with await) to add the offer to peerConnection
  // *** TODO ***: send an 'invite' message with the offer to the peer.
  socket.emit('invite', offer); 
}

// --------------------------------------------------------------------------
// Caller has sent Invite with SDP offer. I am the Callee.
// Set remote description and send back an Ok answer.
async function handle_invite(offer) {
  console.log('Received Invite offer from Caller: ', offer);
  // *** TODO ***: use setRemoteDescription (with await) to add the offer SDP to peerConnection 
  // *** TODO ***: use createAnswer (with await) to generate an answer SDP
  // *** TODO ***: use setLocalDescription (with await) to add the answer SDP to peerConnection
  // *** TODO ***: send an 'ok' message with the answer to the peer.
  socket.emit('ok', answer); 
}

// --------------------------------------------------------------------------
// Callee has sent Ok answer. I am the Caller.
// Set remote description.
async function handle_ok(answer) {
  console.log('Received OK answer from Callee: ', answer);
  // *** TODO ***: use setRemoteDescription (with await) to add the answer SDP 
  //               the peerConnection
}

// ==========================================================================
// 5. ICE negotiation and remote stream handling
// ==========================================================================

// --------------------------------------------------------------------------
// A local ICE candidate has been created by the peerConnection.
// Send it to the peer via the server.
async function handle_local_icecandidate(event) {
  console.log('Received local ICE candidate: ', event);
  // *** TODO ***: check if there is a new ICE candidate.
  // *** TODO ***: if yes, send a 'ice_candidate' message with the candidate to the peer
}

// --------------------------------------------------------------------------
// The peer has sent a remote ICE candidate. Add it to the PeerConnection.
async function handle_remote_icecandidate(candidate) {
  console.log('Received remote ICE candidate: ', candidate);
  // *** TODO ***: add the received remote ICE candidate to the peerConnection 

}

// ==========================================================================
// 6. Function to handle remote video stream
// ==========================================================================

// --------------------------------------------------------------------------
// A remote track event has been received on the peerConnection.
// Show the remote track video on the web page.
function handle_remote_track(event) {
  console.log('Received remote track: ', event);
  // *** TODO ***: get the first stream of the event and show it in remoteVideo
  //document.getElementById('remoteVideo').srcObject = ...
}

// ==========================================================================
// 7. Functions to establish and use the DataChannel
// ==========================================================================

// --------------------------------------------------------------------------
// Create a data channel: only used by the Caller.
function create_datachannel(peerConnection) {
  console.log('Creating dataChannel. I am the Caller.');

  // *** TODO ***: create a dataChannel on the peerConnection
  //dataChannel = ...

  // *** TODO ***: connect the handlers onopen and onmessage to the handlers below
  //dataChannel. ...

}

// --------------------------------------------------------------------------
// Handle remote data channel from Caller: only used by the Callee.
function handle_remote_datachannel(event) {
  console.log('Received remote dataChannel. I am Callee.');

  // *** TODO ***: get the data channel from the event

  // *** TODO ***: add event handlers for onopen and onmessage events to the dataChannel

}

// --------------------------------------------------------------------------
// Handle Open event on dataChannel: show a message.
// Received by the Caller and the Callee.
function handle_datachannel_open(event) {
  dataChannel.send('*** Channel is ready ***');
}

// --------------------------------------------------------------------------
// Send message to peer when Send button is clicked
function sendMessage() {
  var message = document.getElementById('dataChannelInput').value;
  document.getElementById('dataChannelInput').value = '';
  document.getElementById('dataChannelOutput').value += '        ME: ' + message + '\n';

  // *** TODO ***: send the message through the dataChannel

}

// Handle Message from peer event on dataChannel: display the message
function handle_datachannel_message(event) {
  document.getElementById('dataChannelOutput').value += 'PEER: ' + event.data + '\n';
}

// ==========================================================================
// 8. Functions to end call
// ==========================================================================

// --------------------------------------------------------------------------
// HangUp: Send a bye message to peer and close all connections and streams.
function hangUp() {
  // *** TODO ***: Write a console log

  // *** TODO ***: send a bye message with the room name to the server

  // Switch off the local stream by stopping all tracks of the local stream
  var localVideo = document.getElementById('localVideo')
  var remoteVideo = document.getElementById('remoteVideo')
  // *** TODO ***: remove the tracks from localVideo and remoteVideo

  // *** TODO ***: set localVideo and remoteVideo source objects to null

  // *** TODO ***: close the peerConnection and set it to null

  // *** TODO ***: close the dataChannel and set it to null

  document.getElementById('dataChannelOutput').value += '*** Channel is closed ***\n';
}

// --------------------------------------------------------------------------
// Clean-up: hang up before unloading the window
window.onbeforeunload = function(e) {
  hangUp();
}
