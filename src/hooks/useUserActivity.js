import { useAuth } from '../contexts/AuthContext';

export const useUserActivity = () => {
    const { currentUser, getUserProgress, updateUserProgress, userProgress } = useAuth();

    const trackActivity = async (type, details) => {
        if (!currentUser) return;

        // Use cached state or fetch fresh
        const currentProgress = userProgress || await getUserProgress(currentUser.uid);

        const newActivity = {
            type,
            details,
            timestamp: new Date().toISOString(),
            id: Math.random().toString(36).substr(2, 9)
        };

        const updatedData = { ...currentProgress };


        // Update counts based on activity
        if (type === 'aptitude_solve') updatedData.questionsSolved += 1;
        if (type === 'programming_solve') updatedData.questionsSolved += 2;
        if (type === 'interview_view') updatedData.mockInterviews += 0.5;
        if (type === 'ai_chat') updatedData.questionsSolved += 0.2; // Minor credit for AI interaction
        if (type === 'resume_upload') updatedData.mockInterviews += 1; // Significant prep activity

        // Add to recent activity list (keep last 10)
        updatedData.recentActivity = [newActivity, ...(currentProgress.recentActivity || [])].slice(0, 10);

        // Ensure numbers don't stay in decimals forever for clean UI
        updatedData.questionsSolved = Math.round(updatedData.questionsSolved * 10) / 10;
        updatedData.mockInterviews = Math.round(updatedData.mockInterviews * 10) / 10;

        await updateUserProgress(currentUser.uid, updatedData);
    };

    return { trackActivity };
};
