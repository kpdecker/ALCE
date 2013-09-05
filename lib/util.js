module.exports = {
  extractRange: function(src, range) {
    if (range[0] >= range[1]) {
      return '';
    }

    // Offset both sides to account for the "(" and ")" chars
    return src.substring(range[0] - 1, range[1] - 1);
  }
};
