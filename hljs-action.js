(()=>{
	/** @param {Element} ele */
	function AddCopyButton(ele)
	{
		var btn=document.createElement("button");
		btn.classList.add("hljs-btn","hljs-copy-btn");
		btn.textContent="Copy";
		btn.addEventListener("click",()=>{
			navigator.clipboard.writeText(ele.textContent);
			btn.textContent="Copied!";
			setTimeout(()=>btn.textContent="Copy",2000);
		});
		ele.before(btn);
	}
	window.hljs.addActions=()=>{
		document.querySelectorAll("pre>code").forEach((ele)=>{
			AddCopyButton(ele);
		});
	}
})();