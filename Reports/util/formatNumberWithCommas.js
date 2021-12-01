//Add commas to number.
//1000000 -> 1,000,000
export default function formatNumberWithCommas(number) {
  if(isNaN(number) || !number){
    return number;
  }
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}