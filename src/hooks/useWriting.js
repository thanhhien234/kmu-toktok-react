import { useState, useEffect } from 'react';
import { useCookies } from 'react-cookie';
import { postWriting, getWriting, getFeedback } from '../api/writingApi';
import useWritingStore from '../store/useWritingStore';

const useWriting = (writingId) => {
    const [cookies] = useCookies(['accessToken']);
    const [content, setContent] = useState('');
    const [originalContent, setOriginalContent] = useState('');
    const [assignment, setAssignment] = useState(null);
    const [feedback, setFeedback] = useState('');
    const [isContentModified, setIsContentModified] = useState(false);
    const [isWaitingForFeedback, setIsWaitingForFeedback] = useState(false);
    const [writingList] = useWritingStore((state) => [state.writingList, state.setWritingList]);

    useEffect(() => {
        const assignment = writingList.find((item) => item.id === parseInt(writingId));
        if (!assignment) return;
        setAssignment(assignment);

        getWriting(cookies.accessToken, writingId)
            .then((res) => {
                setContent(res.data.content);
                setOriginalContent(res.data.content);
                setFeedback('');
            })
            .catch((error) => {
                alert(error.message);
            });
    }, [writingId, cookies.accessToken, writingList]);

    const handleContentChange = (newContent) => {
        setContent(newContent);
        setIsContentModified(newContent !== originalContent);
    };

    const handleSaveClick = () => {
        postWriting(cookies.accessToken, writingId, 1, content)
            .then(() => {
                alert('과제가 제출되었습니다.');
                setOriginalContent(content);
                setIsContentModified(false);
            })
            .catch((error) => {
                if (error.message === 'EXPIRED_ASSIGNMENT') {
                    alert('과제 제출 기간이 아닙니다.');
                } else {
                    alert(error.message);
                }
            });
    };

    const handleFeedbackClick = () => {
        setIsWaitingForFeedback(true);
        getFeedback(cookies.accessToken, writingId, content)
            .then((res) => {
                setFeedback(res.data.feedback);
                setIsWaitingForFeedback(false);
            })
            .catch((error) => {
                alert(error.message);
                setIsWaitingForFeedback(false);
            });
    };

    return {
        content,
        handleContentChange,
        assignment,
        feedback,
        handleSaveClick,
        handleFeedbackClick,
        isContentModified,
        isWaitingForFeedback
    };
};

export default useWriting;