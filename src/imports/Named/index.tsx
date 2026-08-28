import svgPaths from "./svg-kdyb39m89m";

function Header1() {
  return (
    <div className="content-stretch flex flex-col gap-[4px] items-start relative shrink-0" data-name="Header">
      <p className="[word-break:break-word] font-['Inter:Medium',sans-serif] font-medium leading-[1.12] not-italic relative shrink-0 text-[#272727] text-[22.78px] whitespace-nowrap">Simultaneous Upload Warning</p>
    </div>
  );
}

function Header() {
  return (
    <div className="relative shrink-0 w-full" data-name="Header">
      <div aria-hidden className="absolute border-[#d9d9d9] border-b border-solid inset-[0_0_-1px_0] pointer-events-none" />
      <div className="flex flex-row items-center justify-center size-full">
        <div className="content-stretch flex items-center justify-between px-[24px] py-[12px] relative size-full">
          <Header1 />
          <div className="bg-white relative rounded-[25px] shrink-0 size-[44px]" data-name="Icon button Light">
            <div className="flex flex-row items-center justify-center size-full">
              <div className="content-stretch flex items-center justify-center p-[8px] relative size-full">
                <div className="overflow-clip relative shrink-0 size-[24px]" data-name="Cancel/close">
                  <div className="absolute flex inset-[0_2.14%_2.14%_0] items-center justify-center" style={{ containerType: "size" }}>
                    <div className="-rotate-45 flex-none h-[hypot(50cqw,50cqh)] w-[hypot(50cqw,-50cqh)]">
                      <div className="relative size-full" data-name="Vector">
                        <div className="absolute inset-[-4.52%]">
                          <svg className="block size-full" fill="none" height="18.1066" preserveAspectRatio="none" viewBox="0 0 18.1066 18.1066" width="18.1066">
                            <path d={svgPaths.p3b6d0d8a} id="Vector" stroke="#272727" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Frame() {
  return (
    <div className="content-stretch flex items-center relative shrink-0 w-full">
      <p className="[word-break:break-word] flex-[1_0_0] font-['Inter:Regular',sans-serif] font-normal leading-[20px] min-w-px not-italic relative text-[#272727] text-[16px]">You have a batch currently processing. Uploading a new batch at the same time means the system will not cross-check files between the two batches. To ensure all files are validated against each other, wait for the current processing to finish.</p>
    </div>
  );
}

function MiddleArea() {
  return (
    <div className="relative rounded-[4px] shrink-0 w-full" data-name="Middle area">
      <div className="content-stretch flex flex-col gap-[16px] items-start p-[32px] relative size-full">
        <Frame />
      </div>
    </div>
  );
}

function Padding() {
  return (
    <div className="content-stretch flex flex-col items-start overflow-clip p-[12px] relative rounded-[3px] shrink-0" data-name="Padding">
      <div className="relative shrink-0" data-name="Content">
        <div className="flex flex-row items-center size-full">
          <div className="content-stretch flex items-center relative size-full">
            <p className="[word-break:break-word] font-['Inter:Medium',sans-serif] font-medium leading-[20px] not-italic relative shrink-0 text-[#004080] text-[16px] whitespace-nowrap">Cancel</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Padding1() {
  return (
    <div className="content-stretch flex flex-col items-start overflow-clip p-[12px] relative rounded-[3px] shadow-[0px_1px_0px_0px_rgba(0,0,0,0.08)] shrink-0" data-name="Padding">
      <div aria-hidden className="absolute bg-[#004080] inset-0 pointer-events-none rounded-[3px]" />
      <div className="relative shrink-0" data-name="Content">
        <div className="flex flex-row items-center size-full">
          <div className="content-stretch flex items-center relative size-full">
            <p className="[word-break:break-word] font-['Inter:Medium',sans-serif] font-medium leading-[20px] not-italic relative shrink-0 text-[16px] text-white whitespace-nowrap">Continue</p>
          </div>
        </div>
      </div>
      <div className="absolute inset-0 pointer-events-none rounded-[inherit] shadow-[inset_0px_-1px_0px_0px_rgba(0,0,0,0.2)]" />
    </div>
  );
}

function RightSide() {
  return (
    <div className="content-stretch flex gap-[10px] items-center justify-end relative shrink-0" data-name="Right side">
      <div className="bg-[rgba(255,255,255,0)] relative rounded-[3px] shrink-0" data-name="Text button">
        <div className="flex flex-col items-center justify-center overflow-clip rounded-[inherit] size-full">
          <div className="content-stretch flex flex-col items-center justify-center p-px relative size-full">
            <Padding />
          </div>
        </div>
      </div>
      <div className="bg-[rgba(255,255,255,0)] relative rounded-[3px] shrink-0" data-name="Destrutive button">
        <div className="flex flex-col items-center justify-center overflow-clip rounded-[inherit] size-full">
          <div className="content-stretch flex flex-col items-center justify-center p-px relative size-full">
            <Padding1 />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Named() {
  return (
    <div className="bg-white content-stretch flex flex-col items-start overflow-clip relative rounded-[8px] shadow-[0px_6px_12px_-6px_rgba(39,39,39,0.12),0px_8px_24px_-4px_rgba(39,39,39,0.08)] size-full" data-name="Named">
      <Header />
      <MiddleArea />
      <div className="bg-white relative shrink-0 w-full" data-name="Bottom">
        <div aria-hidden className="absolute border-[#d9d9d9] border-solid border-t inset-0 pointer-events-none" />
        <div className="flex flex-row items-center justify-end size-full">
          <div className="content-stretch flex gap-[24px] items-center justify-end px-[24px] py-[16px] relative size-full">
            <RightSide />
          </div>
        </div>
      </div>
    </div>
  );
}