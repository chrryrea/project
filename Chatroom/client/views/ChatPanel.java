package client.views;

import java.awt.BorderLayout;
import java.awt.Color;
import java.awt.Component;
import java.awt.Dimension;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.awt.event.ComponentAdapter;
import java.awt.event.ComponentEvent;
import java.awt.event.ContainerEvent;
import java.awt.event.ContainerListener;
import java.awt.event.KeyEvent;
import java.awt.event.KeyListener;
import java.io.File;
import java.io.IOException;
import java.util.Stack;
import java.util.logging.Level;
import java.util.logging.Logger;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.ArrayList;
import java.util.List;

import javax.swing.BorderFactory;
import javax.swing.BoxLayout;
import javax.swing.JButton;
import javax.swing.JEditorPane;
import javax.swing.JFileChooser;
import javax.swing.JPanel;
import javax.swing.JScrollBar;
import javax.swing.JScrollPane;
import javax.swing.JTextField;
import javax.swing.ScrollPaneConstants;
import javax.swing.text.AttributeSet;
import javax.swing.text.BadLocationException;
import javax.swing.text.MutableAttributeSet;
import javax.swing.text.SimpleAttributeSet;
import javax.swing.text.StyleConstants;

import client.Card;
import client.ChatHistoryManager;
import client.Client;
import client.ClientUtils;
import client.ICardControls;

public class ChatPanel extends JPanel {
    private static Logger logger = Logger.getLogger(ChatPanel.class.getName());
    private JPanel chatArea = null;
    private UserListPanel userListPanel;
    private ChatHistoryManager chatHistoryManager;
    public ChatPanel(ICardControls controls){
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
        scroll.setBorder(BorderFactory.createEmptyBorder());
        // no need to add content specifically because scroll wraps it
        wrapper.add(scroll);
        this.add(wrapper, BorderLayout.CENTER);

        JPanel input = new JPanel();
        input.setLayout(new BoxLayout(input, BoxLayout.X_AXIS));
        JTextField textValue = new JTextField();
        input.add(textValue);
        JButton button = new JButton("Send");
        // lets us submit with the enter key instead of just the button click
        textValue.addKeyListener(new KeyListener() {

            @Override
            public void keyTyped(KeyEvent e) {

            }

            @Override
            public void keyPressed(KeyEvent e) {
                if (e.getKeyCode() == KeyEvent.VK_ENTER) {
                    button.doClick();
                }
            }

            @Override
            public void keyReleased(KeyEvent e) {

            } //ie48 11/29

        });
                JButton saveButton = new JButton("Save History");
        saveButton.addActionListener(new ActionListener() {
            @Override
            public void actionPerformed(ActionEvent e) {
                saveChatHistoryToFile();
            }
        });
        input.add(saveButton);
        button.addActionListener((event) -> {
            try {
                String text = textValue.getText().trim();
                if (text.length() > 0) {
                    Client.INSTANCE.sendMessage(text);
                    textValue.setText(""); // clear the original text
        
                    // debugging
                    logger.log(Level.FINEST, "Content: " + content.getSize());
                    logger.log(Level.FINEST, "Parent: " + this.getSize());
                }
            } catch (NullPointerException | IOException e) {
                e.printStackTrace();
            }
        });
        chatArea = content;
        input.add(button);
        userListPanel = new UserListPanel(controls);
        this.add(userListPanel, BorderLayout.EAST);
        this.add(input, BorderLayout.SOUTH);
        this.setName(Card.CHAT.name());
        controls.addPanel(Card.CHAT.name(), this);
        chatArea.addContainerListener(new ContainerListener() {

            @Override
            public void componentAdded(ContainerEvent e) {
                if (chatArea.isVisible()) {
                    chatArea.revalidate();
                    chatArea.repaint();
                }
            }

            @Override
            public void componentRemoved(ContainerEvent e) {
                if (chatArea.isVisible()) {
                    chatArea.revalidate();
                    chatArea.repaint();
                }
            }

        });
        this.addComponentListener(new ComponentAdapter() {
            @Override
            public void componentResized(ComponentEvent e) {
                // System.out.println("Resized to " + e.getComponent().getSize());
                // rough concepts for handling resize
                // set the dimensions based on the frame size
                Dimension frameSize = wrapper.getParent().getParent().getSize();
                int w = (int) Math.ceil(frameSize.getWidth() * .3f);
                
                userListPanel.setPreferredSize(new Dimension(w, (int)frameSize.getHeight()));
                userListPanel.revalidate();
                userListPanel.repaint();
            }

            @Override
            public void componentMoved(ComponentEvent e) {
                // System.out.println("Moved to " + e.getComponent().getLocation());
            }
        });
        // onHistoryLoad(chatHistoryManager.loadChatHistory());
    }
    public void onHistoryLoad(List<String> history) {
        for (String message : history) {
            addText(message);
        }
    }
    private void saveChatHistoryToFile() {
        List<String> allMessages = getAllMessages();
        JFileChooser fileChooser = new JFileChooser();
        fileChooser.setDialogTitle("Save Chat History");
        int userSelection = fileChooser.showSaveDialog(this);

        if (userSelection == JFileChooser.APPROVE_OPTION) {
            File fileToSave = fileChooser.getSelectedFile();
            ChatHistoryManager.saveChatHistory(allMessages);
        }
    }
        private List<String> getAllMessages() {
        List<String> allMessages = new ArrayList<>();
        Component[] components = chatArea.getComponents();

        for (Component component : components) {
            if (component instanceof JEditorPane) {
                JEditorPane textContainer = (JEditorPane) component;
                String text = textContainer.getText();
                allMessages.add(text);
            }
        }

        return allMessages;
    }
    public void addUserListItem(long clientId, String clientName){
        userListPanel.addUserListItem(clientId, clientName);
    }
    public void removeUserListItem(long clientId){
        userListPanel.removeUserListItem(clientId);
    }
    public void clearUserList(){
        userListPanel.clearUserList();
    }
    public void addText(String text) {
        JPanel content = chatArea;
        // add message
        JEditorPane textContainer = parseAndFormatText(text, content, "text/html");
        // sizes the panel to attempt to take up the width of the container
        // and expand in height based on word wrapping
        textContainer.setLayout(null);
        textContainer.setPreferredSize(
                new Dimension(content.getWidth(), ClientUtils.calcHeightForText(this,text, content.getWidth())));
        textContainer.setMaximumSize(textContainer.getPreferredSize());
        textContainer.setEditable(false);
        ClientUtils.clearBackground(textContainer);
        // add to container and tell the layout to revalidate
        content.add(textContainer);
        // scroll down on new message
        JScrollBar vertical = ((JScrollPane) chatArea.getParent().getParent()).getVerticalScrollBar();
        vertical.setValue(vertical.getMaximum());
    }
    private JEditorPane parseAndFormatText(String text, JPanel content, String contentType) {
        JEditorPane textContainer = createFormattedTextContainer(text, content, contentType);
        return textContainer;
    }
    
    private JEditorPane createFormattedTextContainer(String text, JPanel content, String contentType) {
        JEditorPane textContainer = new JEditorPane(contentType, "");
        textContainer.setContentType(contentType);
    
        // Check if the text contains any formatting markers before applying HTML tags
        if (text.matches(".*\\*\\*|\\*|__|\\[color=|\\[/color\\].*")) {
            // Split the text into segments based on formatting markers
            String[] segments = text.split("(?<=\\*\\*|\\*|__|\\[color=|\\[/color\\])|(?=\\*\\*|\\*|__|\\[color=|\\[/color\\])");
            // Maintain a stack of formatting attributes
            Stack<MutableAttributeSet> attributeStack = new Stack<>();
            attributeStack.push(new SimpleAttributeSet());
            for (String segment : segments) {
                AttributeSet attrs = getAttributesForSegment(segment, attributeStack.peek());
                appendSegmentToTextContainer(textContainer, segment, attrs);
                updateAttributeStack(attributeStack, segment);
            }
        } else {
            // If no formatting markers are found, use the text as is
            textContainer.setText(text);
        }
        return textContainer;
    }
    
    private AttributeSet getAttributesForSegment(String segment, AttributeSet parentAttrs) {
        MutableAttributeSet attrs = new SimpleAttributeSet(parentAttrs);
        if (segment.startsWith("**")) {
            // Bold formatting detected
            StyleConstants.setBold(attrs, !StyleConstants.isBold(attrs));
        } else if (segment.startsWith("*")) {
            // Italics formatting detected
            StyleConstants.setItalic(attrs, !StyleConstants.isItalic(attrs));
        } else if (segment.startsWith("__")) {
            // Underline formatting detected
            StyleConstants.setUnderline(attrs, !StyleConstants.isUnderline(attrs));
        } else if (segment.startsWith("[color=") && segment.endsWith("]")) {
            // Color formatting detected
            String colorValue = extractFormattingInfo(segment, "color");
            applyColorFormatting(attrs, colorValue);
        }

        return attrs;
    }

    private void appendSegmentToTextContainer(JEditorPane textContainer, String segment, AttributeSet attrs) {
        try {
            // Insert the segment into the document with the applied attributes
            textContainer.getDocument().insertString(textContainer.getDocument().getLength(), "<html>" + segment + "</html>", attrs);
        } catch (BadLocationException e) {
            e.printStackTrace();
        }
    }

    private void applyColorFormatting(MutableAttributeSet attrs, String colorValue) {
        // Apply color formatting based on colorValue
        // For simplicity, assume colorValue is a color name or hex code
        if (colorValue.startsWith("#")) {
            // Assume it's a hex code
            StyleConstants.setForeground(attrs, Color.decode(colorValue));
        } else {
            logger.log(Level.FINE, "Color Formatting requires hexcode ");
        }
    }

    private String extractFormattingInfo(String text, String formatType) {
        // Extract and return the formatting information
        // For simplicity, assume formattingInfo is a color name or hex code
        if (formatType.equals("color")) {
            Pattern pattern = Pattern.compile(".*\\[color=(.*?)\\].*\\[/color\\].*");
            Matcher matcher = pattern.matcher(text);
            if (matcher.find()) {
                return matcher.group(1);
            }
        }
        return "";
    }

    private void updateAttributeStack(Stack<MutableAttributeSet> attributeStack, String segment) {
        // Update the attribute stack based on the segment
        if (segment.startsWith("**") || segment.startsWith("*") || segment.startsWith("__") || segment.startsWith("[color=")) {
            // Push a new SimpleAttributeSet with the current attributes to the stack
            attributeStack.push(copyAttributes(attributeStack.peek()));
        }
    }
    
    private MutableAttributeSet copyAttributes(AttributeSet source) {
        MutableAttributeSet copy = new SimpleAttributeSet();
        copy.addAttributes(source);
        return copy;
    }

}