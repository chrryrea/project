package client.views;

import java.awt.BorderLayout;
import java.awt.Color;
import java.awt.Component;
import java.awt.Dimension;
import java.awt.event.ContainerEvent;
import java.awt.event.ContainerListener;
import java.util.HashMap;
import java.util.Map;
import java.util.logging.Level;
import java.util.logging.Logger;

import javax.swing.BoxLayout;
import javax.swing.JEditorPane;
import javax.swing.JPanel;
import javax.swing.JScrollPane;
import javax.swing.ScrollPaneConstants;

import client.ClientUtils;
import client.ICardControls;
import server.ServerThread;

public class UserListPanel extends JPanel {
    JPanel userListArea;
    private static Logger logger = Logger.getLogger(UserListPanel.class.getName());
    private Map<Long, Boolean> userMuteStatus = new HashMap<>();
    private Map<String, Long> lastMessageSenders = new HashMap<>();
    private long lastMessageSender;  
    
    public UserListPanel(ICardControls controls) {
        super(new BorderLayout(10, 10));
        JPanel wrapper = new JPanel();
        wrapper.setLayout(new BoxLayout(wrapper, BoxLayout.Y_AXIS));
        JPanel content = new JPanel();
        content.setLayout(new BoxLayout(content, BoxLayout.Y_AXIS));
        content.setAlignmentY(Component.BOTTOM_ALIGNMENT);

        // wraps a viewport to provide scroll capabilities
        JScrollPane scroll = new JScrollPane(content);
        scroll.setHorizontalScrollBarPolicy(ScrollPaneConstants.HORIZONTAL_SCROLLBAR_NEVER);
        scroll.setVerticalScrollBarPolicy(ScrollPaneConstants.VERTICAL_SCROLLBAR_AS_NEEDED);
        // scroll.setBorder(BorderFactory.createEmptyBorder());
        // no need to add content specifically because scroll wraps it
        userListArea = content;
        wrapper.add(scroll);
        this.add(wrapper, BorderLayout.CENTER);

        userListArea.addContainerListener(new ContainerListener() {

            @Override
            public void componentAdded(ContainerEvent e) {
                if (userListArea.isVisible()) {
                    userListArea.revalidate();
                    userListArea.repaint();
                }
            }

            @Override
            public void componentRemoved(ContainerEvent e) {
                if (userListArea.isVisible()) {
                    userListArea.revalidate();
                    userListArea.repaint();
                }
            }

        });
    }

    protected void addUserListItem(long clientId, String clientName) {
        logger.log(Level.INFO, "Adding user to list: " + clientName);
        JPanel content = userListArea;
        logger.log(Level.INFO, "Userlist: " + content.getSize());
        JEditorPane textContainer = new JEditorPane("text/plain", clientName);
        textContainer.setName(clientId + "");
        // sizes the panel to attempt to take up the width of the container
        // and expand in height based on word wrapping
        textContainer.setLayout(null);
        textContainer.setPreferredSize(
                new Dimension(content.getWidth(), ClientUtils.calcHeightForText(this, clientName, content.getWidth())));
        textContainer.setMaximumSize(textContainer.getPreferredSize());
        textContainer.setEditable(false);
        // remove background and border (comment these out to see what it looks like
        // otherwise)
        ClientUtils.clearBackground(textContainer);
        // add to container
        content.add(textContainer);
        if (userMuteStatus.containsKey(clientId) && userMuteStatus.get(clientId)) {
            textContainer.setForeground(Color.GRAY); 
        }
        if (clientId == lastMessageSender) {
            textContainer.setBackground(Color.YELLOW); // Highlight the background for the last message sender
        }
    }
    public void updateUserMuteStatus(long clientId, boolean isMuted) {
        userMuteStatus.put(clientId, isMuted);
        updateUI();
    }

    public void updateLastMessageSender(long clientId) {
        lastMessageSender = clientId;
        updateUI();
    }
    public void updateUI() {
        //repaintUserListArea();
    }
    protected void removeUserListItem(long clientId) {
        logger.log(Level.INFO, "removing user list item for id " + clientId);
        Component[] cs = userListArea.getComponents();
        for (Component c : cs) {
            if (c.getName().equals(clientId + "")) {
                userListArea.remove(c);
                break;
            }
        }
    }
    /*private void repaintUserListArea() {
        Component[] cs = userListArea.getComponents();
        for (Component c : cs) {
            JEditorPane textContainer = (JEditorPane) c;
            long clientId = Long.parseLong(textContainer.getName());
            if (userMuteStatus.containsKey(clientId) && userMuteStatus.get(clientId)) {
                textContainer.setForeground(Color.GRAY);
            } else {
                textContainer.setForeground(Color.BLACK);
            }
            if (clientId == lastMessageSender) {
                textContainer.setBackground(Color.YELLOW);
            } else {
                textContainer.setBackground(Color.BLACK);  
            }
        }
    }*/
    protected void clearUserList() {
        Component[] cs = userListArea.getComponents();
        for (Component c : cs) {
            userListArea.remove(c);
        }
    }
}