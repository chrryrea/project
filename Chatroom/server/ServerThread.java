package server;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileReader;
import java.io.FileWriter;
import java.io.IOException;
import java.io.ObjectInputStream;
import java.io.ObjectOutputStream;
import java.net.Socket;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.logging.Level;
import java.util.logging.Logger;

import common.Constants;
import common.Payload;
import common.PayloadType;
import common.RoomResultPayload;

/**
 * A server-side representation of a single client
 */
public class ServerThread extends Thread {
    private Socket client;
    private String clientName;
    private boolean isRunning = false;
    private ObjectOutputStream out;// exposed here for send()
    // private Server server;// ref to our server so we can call methods on it
    // more easily
    private Room currentRoom;
    private static Logger logger = Logger.getLogger(ServerThread.class.getName());
    private long myId;
    private Set<String> muteList = new HashSet<>();

    public void setClientId(long id) {
        myId = id;
    }

    public long getClientId() {
        return myId;
    }

    public boolean isRunning() {
        return isRunning;
    }

    private void info(String message) {
        System.out.println(String.format("Thread[%s]: %s", getId(), message));
    }

    public ServerThread(Socket myClient, Room room) {
        info("Thread created");
        // get communication channels to single client
        this.client = myClient;
        this.currentRoom = room;
        loadMuteList();
    }
    private void applyMuteList() {
        synchronized (currentRoom) {
            for (ServerThread client : currentRoom.getClients()) {
                if (muteList.contains(client.getClientName())) {
                    mute(client);
                }
            }
        }
    } //ie48 12/13
    private void loadMuteList() {
        try {
            File file = new File("mute_lists", clientName + "_mute_list.csv");
            if (file.exists()) {
                BufferedReader reader = new BufferedReader(new FileReader(file));
                String line;
                while ((line = reader.readLine()) != null) {
                    muteList.add(line.trim());
                }
                reader.close();
                applyMuteList();
            }
        } catch (IOException e) {
            e.printStackTrace();
        } //ie48 12/13
    }

    public void saveMuteList() {
        try {
            File directory = new File("mute_lists");
            if (!directory.exists()) {
                directory.mkdirs();
            }

            File file = new File(directory, clientName + "_mute_list.csv");
            FileWriter writer = new FileWriter(file);
            for (String mutedUser : muteList) {
                writer.write(mutedUser + "\n");
            }
            writer.close();
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    public Set<String> getMuteList() {
        return muteList;
    }

    public void mute(ServerThread targetUser) {
        muteList.add(targetUser.getClientName());
        targetUser.sendMessage(Constants.DEFAULT_CLIENT_ID, "You have been muted by " + clientName);
    }

    public void unmute(ServerThread targetUser) {
        muteList.remove(targetUser.getClientName());
        targetUser.sendMessage(Constants.DEFAULT_CLIENT_ID, "You have been unmuted by " + clientName);
    } // ie48 12/13

    protected void setClientName(String name) {
        if (name == null || name.isBlank()) {
            System.err.println("Invalid client name being set");
            return;
        }
        clientName = name;
    }

    protected String getClientName() {
        return clientName;
    }

    protected synchronized Room getCurrentRoom() {
        return currentRoom;
    }

    protected synchronized void setCurrentRoom(Room room) {
        if (room != null) {
            currentRoom = room;
        } else {
            info("Passed in room was null, this shouldn't happen");
        }
    }

    public void disconnect() {
        sendConnectionStatus(myId, getClientName(), false);
        info("Thread being disconnected by server");
        isRunning = false;
        cleanup();
    }
    private boolean containsBoldText(String text) {
        return text.matches(".*\\*\\*.*\\*\\*.*");
    }
    
    private boolean containsItalicText(String text) {
        return text.matches(".*\\*.*\\*.*");
    }
    
    private boolean containsUnderlineText(String text) {
        return text.matches(".*__.*__.*");
    }
    
    private boolean containsColorText(String text) {
        return text.matches(".*\\[color=.*\\].*\\[/color\\].*");
    }
    // send methods

    public boolean sendRoomName(String name) {
        Payload p = new Payload();
        p.setPayloadType(PayloadType.JOIN_ROOM);
        p.setMessage(name);
        return send(p);
    }

    public boolean sendRoomsList(String[] rooms, String message) {
        RoomResultPayload payload = new RoomResultPayload();
        payload.setRooms(rooms);
        //Fixed in Module7.Part9
        if(message != null){
            payload.setMessage(message);
        }
        return send(payload);
    }

    public boolean sendExistingClient(long clientId, String clientName) {
        Payload p = new Payload();
        p.setPayloadType(PayloadType.SYNC_CLIENT);
        p.setClientId(clientId);
        p.setClientName(clientName);
        return send(p);
    }

    public boolean sendResetUserList() {
        Payload p = new Payload();
        p.setPayloadType(PayloadType.RESET_USER_LIST);
        return send(p);
    }

    public boolean sendClientId(long id) {
        Payload p = new Payload();
        p.setPayloadType(PayloadType.CLIENT_ID);
        p.setClientId(id);
        return send(p);
    }

    public boolean sendMessage(long clientId, String message) {
        Payload p = new Payload();
        p.setPayloadType(PayloadType.MESSAGE);
        p.setClientId(clientId);
        p.setMessage(message);
        return send(p);
    }
    public boolean sendFlip(String clientName, String message) {
        Payload p = new Payload();
        p.setPayloadType(PayloadType.FLIP);
        p.setClientName(clientName);
        p.setMessage(message);
        return send(p);
    }
    public boolean sendRoll(String clientName, String message) {
        Payload p = new Payload();
        p.setPayloadType(PayloadType.ROLL);
        p.setClientName(clientName);
        p.setMessage(message);
        return send(p);
    }

    public boolean sendConnectionStatus(long clientId, String who, boolean isConnected) {
        Payload p = new Payload();
        p.setPayloadType(isConnected ? PayloadType.CONNECT : PayloadType.DISCONNECT);
        p.setClientId(clientId);
        p.setClientName(who);
        p.setMessage(isConnected ? "connected" : "disconnected");
        return send(p);
    }

    private boolean send(Payload payload) {
        // added a boolean so we can see if the send was successful
        try {
            // TODO add logger
            logger.log(Level.FINE, "Outgoing payload: " + payload);
            out.writeObject(payload);
            logger.log(Level.INFO, "Sent payload: " + payload);
            return true;
        } catch (IOException e) {
            info("Error sending message to client (most likely disconnected)");
            // comment this out to inspect the stack trace
            // e.printStackTrace();
            cleanup();
            return false;
        } catch (NullPointerException ne) {
            info("Message was attempted to be sent before outbound stream was opened: " + payload);
            return true;// true since it's likely pending being opened
        }
    }

    // end send methods
    @Override
    public void run() {
        info("Thread starting");
        try (ObjectOutputStream out = new ObjectOutputStream(client.getOutputStream());
                ObjectInputStream in = new ObjectInputStream(client.getInputStream());) {
            this.out = out;
            isRunning = true;
            Payload fromClient;
            while (isRunning && // flag to let us easily control the loop
                    (fromClient = (Payload) in.readObject()) != null // reads an object from inputStream (null would
                                                                     // likely mean a disconnect)
            ) {

                info("Received from client: " + fromClient);
                processPayload(fromClient);

            } // close while loop
        } catch (Exception e) {
            // happens when client disconnects
            e.printStackTrace();
            info("Client disconnected");
        } finally {
            isRunning = false;
            info("Exited thread loop. Cleaning up connection");
            cleanup();
        }
    }

    void processPayload(Payload p) {
        switch (p.getPayloadType()) {
            case CONNECT:
                setClientName(p.getClientName());
                break;
            case DISCONNECT:
                Room.disconnectClient(this, getCurrentRoom());
                break;
            case ROLL:
                sendRoll(p.getClientName(), p.getMessage());
                break;
            case FLIP:
                sendFlip(p.getClientName(), p.getMessage());
                break;
            case MESSAGE:
                if (currentRoom != null) {
                    String message = p.getMessage();
                    if (message.startsWith("@")) {
                        String[] parts = message.split(" ",2);
                        if (parts.length>1){
                            String targetUsername = parts[0].substring(1);
                            String privateMessage = parts[1];
                            currentRoom.sendPrivateMessage(this, targetUsername, privateMessage);
                        } 
                    } else if (containsBoldText(message) || containsItalicText(message)
                             || containsUnderlineText(message) || containsColorText(message)) {
                            message = message.replaceAll("\\*\\*(.*?)\\*\\*", "<b>$1</b>");
                            message = message.replaceAll("\\*(.*?)\\*", "<i>$1</i>");
                            message = message.replaceAll("__(.*?)__", "<u>$1</u>");
                            message = message.replaceAll("\\[color=red\\](.*?)\\[/color\\]", "<font color='red'>$1</font>");
                            currentRoom.sendMessage(this, message);
                    } else {
                        currentRoom.sendMessage(this, message);
                    }
                } else {
                    // TODO migrate to lobby
                    // ie48 11/29
                    logger.log(Level.INFO, "Migrating to lobby on message with null room");
                    Room.joinRoom("lobby", this);
                }
                break;
            case GET_ROOMS:
                Room.getRooms(p.getMessage().trim(), this);
                break;
            case CREATE_ROOM:
                Room.createRoom(p.getMessage().trim(), this);
                break;
            case JOIN_ROOM:
                Room.joinRoom(p.getMessage().trim(), this);
                break;
            default:
                break;

        }

    }

    private void cleanup() {
        info("Thread cleanup() start");
        try {
            client.close();
        } catch (IOException e) {
            info("Client already closed");
        }
        info("Thread cleanup() complete");
    }
}