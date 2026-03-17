export const Motion = {
    // Spring physics for elite animations
    spring: {
        gentle: {
            mass: 1,
            damping: 15,
            stiffness: 120,
        },
        bouncy: {
            mass: 1,
            damping: 12,
            stiffness: 200,
        },
        stiff: {
            mass: 1,
            damping: 20,
            stiffness: 300,
        },
    },
    timing: {
        short: 200,
        medium: 400,
        long: 800,
    }
};

export const Interaction = {
    pressScale: 0.96,
    hapticStrength: 'Light', // ImpactFeedbackStyle.Light
};
