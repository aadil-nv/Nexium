export const getShiftMinutes = (shift: string): number => {
    switch (shift) {
      case "Full-Time":
        return 480; // Full-time: 480 minutes
      case "Part-Time":
        return 240; // Part-time: 240 minutes
      case "Contract":
        return 540; // Contract: 540 minutes
      case "Temporary":
        return 420; // Temporary: 420 minutes
      default:
        return 0;
    }
};
