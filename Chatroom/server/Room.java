package server;
import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.File;
import java.io.FileReader;
import java.io.FileWriter;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.logging.Level;
import java.util.logging.Logger;

import common.Constants;

public class Room implements AutoCloseable {
	private String name;
	private List<ServerThread> clients = Collections.synchronizedList(new ArrayList<ServerThread>());
	private boolean isRunning = false;
	// Commands
	private final static String COMMAND_TRIGGER = "/";
	private final static String CREATE_ROOM = "createroom";
	private final static String JOIN_ROOM = "joinroom";
	private final static String DISCONNECT = "disconnect";
	private final static String LOGOUT = "logout";
	private final static String LOGOFF = "logoff";
    private final static String FLIP = "flip";
	private final static String ROLL = "roll";
   	private final static String MUTE = "mute";
	private final static String UNMUTE = "unmute";
	private static Logger logger = Logger.getLogger(Room.class.getName());
	private static final String MUTE_LIST_FILE_PATH = "mute_lists/";

	public Room(String name) {
		this.name = name;
		isRunning = true;
	}

	private void info(String message) {
		logger.log(Level.INFO, String.format("Room[%s]: %s", name, message));
	}

	public String getName() {
		return name;
	}

	public boolean isRunning() {
		return isRunning;
	}

	protected synchronized void addClient(ServerThread client) {
		if (!isRunning) {
			return;
		}
		client.setCurrentRoom(this);
		if (clients.indexOf(client) > -1) {
			info("Attempting to add a client that already exists");
		} else {
			clients.add(client);
			sendConnectionStatus(client, true);
			sendRoomJoined(client);
			sendUserListToClient(client);
		}
	}

	protected synchronized void removeClient(ServerThread client) {
		if (!isRunning) {
			return;
		}
		clients.remove(client);
		// we don't need to broadcast it to the server
		// only to our own Room
		if (clients.size() > 0) {
			// sendMessage(client, "left the room");
			sendConnectionStatus(client, false);
		}
		checkClients();
	}

	/***
	 * Checks the number of clients.
	 * If zero, begins the cleanup process to dispose of the room
	 */
	private void checkClients() {
		// Cleanup if room is empty and not lobby
		if (!name.equalsIgnoreCase("lobby") && clients.size() == 0) {
			close();
		}
	}

	/***
	 * Helper function to process messages to trigger different functionality.
	 * 
	 * @param message The original message being sent
	 * @param client  The sender of the message (since they'll be the ones
	 *                triggering the actions)
	 */
	private boolean processCommands(String message, ServerThread client) {
		boolean wasCommand = false;
		try {
			if (message.startsWith(COMMAND_TRIGGER)) {
				String[] comm = message.split(COMMAND_TRIGGER);
				String part1 = comm[1];
				String[] comm2 = part1.split(" ");
				String command = comm2[0];
				String roomName;
				wasCommand = true;
				switch (command) {
					case CREATE_ROOM:
						roomName = comm2[1];
						Room.createRoom(roomName, client);
						break;
					case JOIN_ROOM:
						roomName = comm2[1];
						Room.joinRoom(roomName, client);
						break;
					case DISCONNECT:
					case LOGOUT:
					case LOGOFF:
						Room.disconnectClient(client, this);
						break;
                    case FLIP:
						System.out.println("Processing roll command"); // Add this line
                        handleFlip(client);
                        break;
                    case ROLL:
						System.out.println("Processing roll command"); // Add this line
						System.out.println("Roll command content: " + comm2[1]);
                        handleRoll(comm2[1], client);
                        break;
                    case MUTE:
                        muteUser(comm2[1], client);
                        break;
                    case UNMUTE:
                        unmuteUser(comm2[1], client);
                        break;
					default:
						wasCommand = false;
						break;
				}
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
		return wasCommand;
	}
	// Command helper methods ie48 12/13
	public void muteUser(String target, ServerThread sender){
		ServerThread targetUser = findClientByUsername(target);
		if (targetUser != null){
			sender.mute(targetUser);
            updateMuteListToFile(sender.getClientName(), target, true);
			sender.sendMessage(Constants.DEFAULT_CLIENT_ID, "User: " + target + " is now muted.");			
		} else {
			sender.sendMessage(Constants.DEFAULT_CLIENT_ID, "User: " + target + " could not be found.");
		}
	}
	public void unmuteUser(String target, ServerThread sender){
		ServerThread targetUser = findClientByUsername(target);
		if (targetUser != null) {
			sender.unmute(targetUser);
            updateMuteListToFile(sender.getClientName(), target, false);
			sender.sendMessage(Constants.DEFAULT_CLIENT_ID, "User: " + target + " is now unmuted.");			
		} else {
			sender.sendMessage(Constants.DEFAULT_CLIENT_ID, "User: " + target + " could not be found.");
		}
	}
	private void updateMuteListToFile(String sender, String target, boolean isMuted) {
        try {
            File file = new File("mute_lists", target + "_mute_list.csv");
            FileWriter writer = new FileWriter(file, true);
            if (isMuted) {
                writer.write(sender + "\n");
            } else {
                File tempFile = new File("mute_lists", target + "_temp.csv");
                BufferedReader reader = new BufferedReader(new FileReader(file));
                BufferedWriter tempWriter = new BufferedWriter(new FileWriter(tempFile));
                String lineToRemove = sender;
                String currentLine;
                while ((currentLine = reader.readLine()) != null) {
                    String trimmedLine = currentLine.trim();
                    if (trimmedLine.equals(lineToRemove)) continue;
                    tempWriter.write(trimmedLine + "\n");
                }
                tempWriter.close();
                reader.close();
                file.delete();
                tempFile.renameTo(file);
            }
            writer.close();
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
    protected void handleFlip(ServerThread client){
        String result = Math.random() < 0.5 ? "Heads" : "Tails";
		sendMessage(null, "Flip result for " + client.getClientName() + " is: <html><u>" + result + "</u></html>");
    } //ie48 11/28
	protected void handleRoll(String roll, ServerThread client) {
		try {
			int result;
			if (roll.matches("\\d+")) {
				// Format: /roll X
				result = Integer.parseInt(roll);
			} else if (roll.matches("\\d+d\\d+")) {
				// Format: /roll #d#
				String[] diceParts = roll.split("d");
				int numDice = Integer.parseInt(diceParts[0]);
				int numSides = Integer.parseInt(diceParts[1]);
				int total = 0;
				for (int i = 0; i < numDice; i++) {
					total += (int) (Math.random() * numSides) + 1;
				}
				result = total;
			} else {
				sendMessage(null, "Invalid Roll.");
				return;
			}
			sendMessage(null, "Roll result for " + client.getClientName() + " is: <html><u>" + result + "</u></html>");
		} catch (NumberFormatException e) {
			sendMessage(null, "Invalid Roll.");
		}
	}
	protected static void getRooms(String query, ServerThread client) {
		String[] rooms = Server.INSTANCE.getRooms(query).toArray(new String[0]);
		client.sendRoomsList(rooms,(rooms!=null&&rooms.length==0)?"No rooms found containing your query string":null);
	}

	protected static void createRoom(String roomName, ServerThread client) {
		if (Server.INSTANCE.createNewRoom(roomName)) {
			Room.joinRoom(roomName, client);
		} else {
			client.sendMessage(Constants.DEFAULT_CLIENT_ID, String.format("Room %s already exists", roomName));
			client.sendRoomsList(null, String.format("Room %s already exists", roomName));
		}
	}

	protected static void joinRoom(String roomName, ServerThread client) {
		if (!Server.INSTANCE.joinRoom(roomName, client)) {
			client.sendMessage(Constants.DEFAULT_CLIENT_ID, String.format("Room %s doesn't exist", roomName));
			client.sendRoomsList(null, String.format("Room %s doesn't exist", roomName));
		}
	}

	protected static void disconnectClient(ServerThread client, Room room) {
		client.setCurrentRoom(null);
		client.disconnect();
		room.removeClient(client);
	}
	// end command helper methods

	/***
	 * Takes a sender and a message and broadcasts the message to all clients in
	 * this room. Client is mostly passed for command purposes but we can also use
	 * it to extract other client info.
	 * 
	 * @param sender  The client sending the message
	 * @param message The message to broadcast inside the room
	 */
	protected synchronized void sendMessage(ServerThread sender, String message) {
		if (!isRunning) {
			return;
		}
		info("Sending message to " + clients.size() + " clients");
		if (sender != null && processCommands(message, sender)) {
			// it was a command, don't broadcast
			return;
		}
		long from = (sender == null) ? Constants.DEFAULT_CLIENT_ID : sender.getClientId();
		synchronized (clients) {
			Iterator<ServerThread> iter = clients.iterator();
			while (iter.hasNext()) {
				ServerThread client = iter.next();
				if (!client.getMuteList().contains(sender)) {
					boolean messageSent = client.sendMessage(from, message);
					if (!messageSent) {
						handleDisconnect(iter, client);
					}
				}
			}
		}
	}

	protected synchronized void sendUserListToClient(ServerThread receiver) {
		logger.log(Level.INFO, String.format("Room[%s] Syncing client list of %s to %s", getName(), clients.size(),
				receiver.getClientName()));
		synchronized (clients) {
			Iterator<ServerThread> iter = clients.iterator();
			while (iter.hasNext()) {
				ServerThread clientInRoom = iter.next();
				if (clientInRoom.getClientId() != receiver.getClientId()) {
					boolean messageSent = receiver.sendExistingClient(clientInRoom.getClientId(),
							clientInRoom.getClientName());
					// receiver somehow disconnected mid iteration
					if (!messageSent) {
						handleDisconnect(null, receiver);
						break;
					}
				}
			}
		}
	}
	protected synchronized void sendPrivateMessage(ServerThread sender, String target, String message) {
		ServerThread recipient = findClientByUsername(target);
        if (recipient != null) {
            if (!recipient.getMuteList().contains(sender.getClientName())) {
                recipient.sendMessage(sender.getClientId(), "[Private] " + sender.getClientName() + ": " + message);
                sender.sendMessage(recipient.getClientId(), "[Private] You to " + recipient.getClientName() + ": " + message);
            } else {
                sender.sendMessage(Constants.DEFAULT_CLIENT_ID, "You cannot send private messages to " + recipient.getClientName() + " because you are muted by them.");
            }
        } else {
            sender.sendMessage(Constants.DEFAULT_CLIENT_ID, "User " + target + " not found in the room");
        }
    } // ie48 11/28
	private ServerThread findClientByUsername(String username) {
		synchronized (clients) {
			for (ServerThread client : clients) {
				if (client.getClientName().equalsIgnoreCase(username)) {
					return client;
				}
			}
		}
		return null;
	}
	protected synchronized void sendRoomJoined(ServerThread receiver) {
		boolean messageSent = receiver.sendRoomName(getName());
		if (!messageSent) {
			handleDisconnect(null, receiver);
		}
	}

	protected synchronized void sendConnectionStatus(ServerThread sender, boolean isConnected) {
		// converted to a backwards loop to help avoid concurrent list modification
		// due to the recursive sendConnectionStatus()
		// this should only be needed in this particular method due to the recusion
		if (clients == null) {
			return;
		}
		synchronized (clients) {
			for (int i = clients.size() - 1; i >= 0; i--) {
				ServerThread client = clients.get(i);
				boolean messageSent = client.sendConnectionStatus(sender.getClientId(), sender.getClientName(),
						isConnected);
				if (!messageSent) {
					clients.remove(i);
					info("Removed client " + client.getClientName());
					checkClients();
					sendConnectionStatus(client, false);
				}
			}
		}
	}

	private synchronized void handleDisconnect(Iterator<ServerThread> iter, ServerThread client) {
		if (iter != null) {
			iter.remove();
		}
		info("Removed client " + client.getClientName());
		checkClients();
		sendConnectionStatus(client, false);
		// sendMessage(null, client.getClientName() + " disconnected");
	}

	public void close() {
		Server.INSTANCE.removeRoom(this);
		isRunning = false;
		clients = null;
	}
}