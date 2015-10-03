var  symbols = ["0", "1", "2", "3", "4", "5", "6", "7", "8", 
                            "9", "a", "b", "c", "d", "e", "f", "g", 
                            "h", "i", "j", "k", "l", "m", "n", "o",
                            "p", "q", "r", "s", "t", "u", "v,", "w",
                            "x", "y", "z"]
module.exports = {
   randomGenerator: function( passLength)
   {

      var classPass = "";

      for( i = 0; i < passLength; i++)
      {
         classPass += symbols[Math.rand()*36];
      }

      return classPass;

   }
}