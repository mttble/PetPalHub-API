
export const handleError = (res, error, customMessage) => {
    console.error(customMessage, error);
    res.status(500).send({ message: customMessage, error: error.message });
};

