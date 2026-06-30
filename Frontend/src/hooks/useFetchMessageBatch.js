import store from "../store/store";
import { fetchMessage } from "../services/messageServices";

const useFetchMessageBatch = ({ conversationId }) => {
    
}

export default useFetchMessageBatch;

/*  This hook is supposed to fetch messages in batches( 10-20 messages in when called once )
                                        +
    Keep track of messages so that you know from which endpoint you have to fetch the messages
                                        +
    This hook will fetch and populate the REDUX STORE of messages of the provided  "CONVERSATION ID"
                                        +
    When opening first time a conversation, fetch the message after checking that the message does not exist for that CONVERSATION ID in the STORE 
*/