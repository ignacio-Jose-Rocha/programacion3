import PropTypes from 'prop-types';

const Message = ({ message, onClose }) => {
  return (
    <div className="fixed top-5 right-5 bg-green-500 text-white p-4 rounded shadow-lg">
      <p>{message}</p>
      <button
        onClick={onClose}
        className="ml-4 bg-transparent text-white font-bold hover:text-gray-200"
      >
        &times;
      </button>
    </div>
  );
};

Message.propTypes = {
    onClose: PropTypes.func.isRequired, // 'onClose' debe ser una función y es requerida
    message: PropTypes.string.isRequired, // 'message' debe ser una cadena y es requerida
  };
  

export default Message;
