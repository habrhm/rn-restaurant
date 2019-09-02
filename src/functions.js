const convertToRupiah = (angka) => 
{
	let rupiah = '';		
	let angkarev = angka.toString().split('').reverse().join('');
	for(let i = 0; i < angkarev.length; i++) if(i%3 == 0) rupiah += angkarev.substr(i,3)+'.';
	return 'Rp. '+rupiah.split('',rupiah.length-1).reverse().join('');
}
const toMinute = (time) => {
    let minutes = Math.floor(time / 60);
    let seconds = time - minutes * 60;
    return `${minutes}:${seconds}`
}
export {convertToRupiah, toMinute}