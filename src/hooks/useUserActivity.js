import { useAuth } from '../contexts/AuthContext';

export const useUserActivity = () => {
    const { currentUser, getUserProgress, updateUserProgress } = useAuth();

    const trackActivity = (type, details) => {
        if (!currentUser) return;

        const currentProgress = getUserProgress(currentUser.uid);
        const newActivity = {
            type,
            details,
            timestamp: new Date().toISOString(),
            id: Math.random().toString(36).substr(2, 9)
        };

        const updatedData = { ...currentProgress };

        // Update counts based on activity
        if (type === 'aptitude_solve') updatedData.questionsSolved += 1;
        if (type === 'interview_view') updatedData.mockInterviews += 0.5; // Weightage

        // Add to recent activity list (keep last 10)
        updatedData.recentActivity = [newActivity, ...(currentProgress.recentActivity || [])].slice(0, 10);

        updateUserProgress(currentUser.uid, updatedData);
    };

    return { trackActivity };
};
