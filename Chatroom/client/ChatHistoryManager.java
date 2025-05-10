package client;


import java.io.BufferedReader;
import java.io.FileReader;
import java.io.FileWriter;
import java.io.IOException;
import java.io.PrintWriter;
import java.time.LocalDateTime;
import java.util.List;
import java.util.ArrayList;

public class ChatHistoryManager {
    private static final String CSV_FILE_PATH = "chat_history.csv";
    private List<String> chatHistory = new ArrayList<>(); 

    public void addMessage(long clientId, String clientName, String message){
        String formattedMessage = String.format("%s: %s", clientName, message);
        chatHistory.add(formattedMessage);
    }

    public static void saveChatHistory(List<String> chatHistory){
        try (PrintWriter writer = new PrintWriter(new FileWriter(CSV_FILE_PATH, true))){
            for (String message : chatHistory){
                writer.println(message);
            }
            writer.flush();
        } catch (IOException e){
            e.printStackTrace();
        }
    }
    public List<String> loadChatHistory() {
        List<String> loadedHistory = new ArrayList<>();
        try (BufferedReader reader = new BufferedReader(new FileReader(CSV_FILE_PATH))) {
            String line;
            while ((line = reader.readLine()) != null) {
                loadedHistory.add(line);
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
        return loadedHistory;
    }

    public List<String> getChatHistory() {
        return loadChatHistory();
    }
}