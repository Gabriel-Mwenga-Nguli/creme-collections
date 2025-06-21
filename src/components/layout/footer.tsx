
import Link from 'next/link';
import { SITE_NAME, FOOTER_COMPANY_LINKS, FOOTER_SUPPORT_LINKS } from '@/lib/constants';
import Logo from '@/components/logo';
import { MapPin, Mail, MessageSquare, Clock, Facebook, Instagram, Landmark, Globe } from 'lucide-react';

const XIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 1200 1227"
    fill="none"
    aria-hidden="true"
    {...props}
  >
    <path
      d="M714.163 519.284L1160.89 0H1055.03L667.137 450.887L357.328 0H0L468.492 681.821L0 1226.37H105.866L515.491 750.218L842.672 1226.37H1200L714.163 519.284ZM569.165 687.828L521.697 619.934L144.011 79.6909H308.863L612.434 513.728L659.902 581.621L1076.01 1143.85H911.161L569.165 687.828Z"
      fill="currentColor"
    />
  </svg>
);

const MpesaIcon = () => (
    <svg role="img" viewBox="0 0 256 160" className="h-8 w-auto rounded" xmlns="http://www.w3.org/2000/svg">
      <rect fill="#4CAF50" width="256" height="160" rx="20"/>
      <text x="50%" y="55%" dominantBaseline="middle" textAnchor="middle" fill="white" fontSize="60" fontWeight="bold" fontFamily="sans-serif">M-PESA</text>
    </svg>
);
  
const MastercardIcon = () => (
    <svg role="img" viewBox="0 0 38 24" xmlns="http://www.w3.org/2000/svg" className="h-8 w-auto">
        <circle cx="12" cy="12" r="12" fill="#EA001B" />
        <circle cx="26" cy="12" r="12" fill="#FF5F00" opacity="0.9" />
    </svg>
);

const AfricaMap = () => (
  <svg
    viewBox="0 0 800 900"
    xmlns="http://www.w3.org/2000/svg"
    className="w-full h-full"
    aria-label="Map of Africa highlighting our service areas in East Africa"
  >
    <defs>
        <filter id="glow">
            <feGaussianBlur stdDeviation="3.5" result="coloredBlur" />
            <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
            </feMerge>
        </filter>
    </defs>
    <g fill="#475569" stroke="#1e293b" strokeWidth="0.5">
      {/* Other African countries with neutral fill */}
      <path d="M136.5,353.5 C137,354 138.5,355 139,357 C138.5,357 137.5,358 136.5,358.5 C136,358 135.5,357.5 135,356.5 C134.5,355.5 135,354.5 136,353.5z" id="Equatorial Guinea"/>
      <path d="M368,103 C370,103.5 371.5,103 373.5,102 C374.5,103.5 374,105 373,106.5 C372,108 371,109.5 369.5,110 C368,109 367,108 366.5,107 C365.5,106.5 365,105 365.5,104 C366,103.5 367,103 368,103z" id="Gambia"/>
      <path d="M371,113 C372,112.5 373.5,112.5 375,113 C376.5,113.5 376,114.5 374,115.5 C372,117 370.5,117.5 369,118 C368.5,117 368,116 368.5,115 C369.5,114 370.5,113.5 371,113z" id="Guinea-Bissau"/>
      <path d="M510,751.5 C511,751.5 512,752 513,753 C512,754 511.5,755 511.5,756 C511,756.5 510,756 509.5,755 C508.5,754.5 509,753 510,751.5z" id="Eswatini"/>
      <path d="M523,728 C524.5,728.5 525,729.5 525,731 C525,732 524,732.5 523,733 C521.5,733 521,732 521,730.5 C521.5,729.5 522,728.5 523,728z" id="Lesotho"/>
      <path d="M312,233 C312.5,233.5 313.5,233.5 314,233 C314,232 315,231.5 316,231 C316.5,230 316.5,228 317,226 C317.5,224.5 318,223 319,222 C318,221.5 317,221 316,221.5 C314.5,222 312.5,223.5 310,225 C308.5,226.5 307.5,228 308,229.5 C308.5,230.5 309.5,231.5 310.5,232 C311,232.5 311.5,233 312,233z" id="Djibouti"/>
      <path d="M578,414 C578,413.5 579,413 580,413 C581,413 582,413.5 582.5,414.5 C583,415.5 583.5,416.5 583,418 C582.5,419 581,419.5 580,419.5 C579,419.5 578,419 578,418 C578,417.5 577.5,416.5 577.5,415.5 C577.5,415 578,414.5 578,414z" id="Comoros"/>
      <path d="M316.5,13 C318,13 319.5,13.5 320,15 C320.5,16 321,17.5 321,19 C319.5,19 318,19 317,19.5 C316,20 315,20.5 314.5,21.5 C313.5,22 313.5,23 314,24 C314,25 313.5,26.5 312.5,27.5 C311,29 309,30 307,31 C306,31.5 304.5,32.5 303.5,33 C302.5,34 301.5,35 300,35 C298.5,35.5 297,35.5 295.5,35.5 C294.5,36 293,36 292,35.5 C291,35 290.5,34 290.5,32.5 C290,31.5 290,30 290,28.5 C290.5,27.5 291.5,26.5 292.5,26 C293.5,25.5 295,24.5 296,24 C297,23.5 298,22.5 298,21.5 C298,20.5 298,19 298.5,18 C299,17.5 299,16 300,15 C301,14 302,13.5 303,13.5 C304.5,13.5 306.5,14 308,14 C310,14 311,13.5 312.5,13 C314,13 315,13 316.5,13z M308.5,18.5 C309,19 309,20 308.5,21 C308,22 307,22.5 306,23 C305,23.5 304.5,24 304,24.5 C303,25.5 302.5,26.5 302,27.5 C301.5,28.5 301,29 301.5,30 C302,30.5 303,30.5 304,30 C304.5,29.5 305,29 305.5,28 C306.5,27 307,26 308,25 C308.5,24.5 309.5,23.5 310,23 C310.5,22.5 311,22 311.5,21 C312.5,20 312.5,19 312,18 C311,17.5 310,17.5 309,18 C308.5,18 308.5,18.5 308.5,18.5z" id="Morocco"/>
      <path d="M125.5,21.5 C127.5,22 129,22.5 130,23 C131,23.5 132,24 133,24 C134.5,23.5 135.5,23 136,22 C137,21 137.5,20.5 137,19 C136.5,18 135,17.5 133,17.5 C132,17.5 130.5,18 129,18.5 C128,19 126.5,20 125.5,21.5z" id="Western Sahara"/>
      <path d="M174.5,75 C176,75.5 177.5,75 178.5,74.5 C179.5,74.5 180,75 180,76 C180.5,77 180.5,78 179.5,78.5 C178.5,79 177,79 176,78.5 C175.5,78.5 175,78 174.5,77.5 C174,76.5 174,75.5 174.5,75z" id="Cape Verde"/>
      <path d="M666.5,263 C667,263 668,263.5 668.5,264 C669,264.5 669.5,265.5 669.5,266 C669.5,267 669,268 668,268.5 C667,269 666,269 665.5,268 C665,267.5 665,266.5 665,265.5 C665,264.5 665.5,263.5 666.5,263z" id="Seychelles"/>
      <path d="M608.5,497 C609,496.5 610.5,496.5 611,497.5 C611,498.5 611,499.5 610.5,500.5 C610,501.5 609,502 608,502 C607.5,501.5 607,501 607,500 C607,499 607.5,498 608.5,497z M616.5,504.5 C617,504 618,504 618.5,504.5 C619,505.5 619,506.5 618,507.5 C617.5,508 616.5,508.5 616,508 C615,507.5 615.5,506 616,505 C616,505 616.5,504.5 616.5,504.5z M622.5,488.5 C623.5,488 624.5,488.5 625,489 C625.5,489.5 625.5,490.5 625,491.5 C624.5,492 623.5,492 622.5,492 C622,491.5 622,490.5 622,489.5 C622,489 622,488.5 622.5,488.5z" id="Sao Tome and Principe"/>
      <path d="M578,574 C579,573 580.5,572.5 581,573.5 C581.5,574.5 581,576 580,577 C579.5,577.5 578.5,578 577.5,578 C576.5,577.5 576,576.5 576,575.5 C576.5,575 577,574.5 578,574z" id="Mauritius"/>
      <path d="M304.5,152 C304.5,151 306,150 307.5,150 C309.5,150.5 311,151.5 312,153 C312.5,154 313,155 313,156.5 C313,158.5 313,160 312.5,161.5 C312,163 311.5,164.5 310,165.5 C308.5,166.5 307.5,167.5 306.5,169 C306,170 305,171 304.5,172 C303.5,173 302,174 301.5,174.5 C300.5,175.5 299,176 297.5,176 C296.5,176 295.5,176.5 294.5,177.5 C293,178.5 292,178.5 291,178 C289.5,177 288.5,175.5 287.5,174 C287,173 286,171.5 286,170 C285.5,168 586,165.5 286.5,163.5 C287.5,162 288.5,161 290,160 C291,159 292.5,158 294,157.5 C295.5,156.5 296.5,155.5 297.5,154 C298.5,153 300,152.5 301,152 C302,152 303.5,152 304.5,152z" id="Burkina Faso"/>
      <path d="M294,29 C294.5,28.5 295.5,28 297,27.5 C299,27 301,27 302.5,27.5 C304.5,28 306,29 307.5,30 C309,31.5 310.5,33 311.5,35 C312.5,37 312.5,39 312,41 C311,43.5 310,45.5 308,47 C306.5,48 304.5,48.5 303,48.5 C301.5,48.5 300,48.5 298.5,48 C297.5,47.5 296,46.5 295,45 C294,43.5 293,41.5 292.5,39.5 C292,37.5 292,35.5 292,33.5 C292,32 292.5,30.5 294,29z" id="Tunisia"/>
      <path d="M336.5,248 C337,247 338,246.5 339,246 C340.5,246 341.5,246.5 342,247.5 C342.5,248.5 342.5,250 342,251 C341,252.5 339.5,253.5 338,254 C337,254.5 336,254 335,253 C334,252 334.5,250.5 335.5,249.5 C336,249 336,248.5 336.5,248z" id="Rwanda"/>
      <path d="M363,260.5 C364,260 365.5,260 366.5,261 C367.5,262 368,263.5 367,265 C366,266.5 364.5,267.5 363,267.5 C362,267 361.5,266 361.5,265 C361.5,263.5 362,261.5 363,260.5z" id="Burundi"/>
      <path d="M260,33 C261,32 262,31.5 263.5,31.5 C266,31.5 268,32.5 270,34 C272,35.5 273.5,37.5 274.5,40 C275.5,42 275.5,44 275,46 C274,48 272.5,50 270.5,51 C269,52 267,52 265,51.5 C263.5,51 262,50 261,48.5 C260,47 259,45 259,43 C258.5,41 258.5,38.5 259,36 C259,35 259.5,34 260,33z" id="Libya"/>
      <path d="M192,27 C193,27 194.5,27.5 196,28 C198,29 200,31 202,33 C204.5,36 206.5,39.5 208,43.5 C209.5,47 210,51 209.5,55 C209,58.5 208,61.5 206,64.5 C204.5,67 202.5,69 200.5,70 C198.5,71 196.5,71 194.5,70.5 C192.5,69.5 190.5,68 189,66 C187,64 185.5,61.5 184.5,58.5 C183.5,56 183.5,53 184,50 C184.5,47 185.5,44.5 187,42 C188.5,39.5 190,37.5 191.5,35.5 C192,34.5 192,33 192,31.5 C192,30 192,28.5 192,27z" id="Algeria"/>
      <path d="M428,210.5 C429,210.5 430.5,210.5 431.5,211.5 C433,212.5 434,214 434,216 C434,217.5 433,219.5 431,221 C430,222 428,222.5 426.5,222 C425.5,221.5 424.5,220.5 424,219 C423.5,217.5 424,215.5 425.5,214 C426.5,213 427,212 427,211 C427,211 427.5,210.5 428,210.5z" id="Malawi"/>
      <path d="M194,76 C195,75.5 196.5,75.5 198,76 C200,77 202,78.5 203.5,80.5 C205,82.5 206,85 205.5,87.5 C205,90.5 203.5,93 201.5,95 C199.5,97 197.5,98.5 195,99 C193,99.5 190.5,99 188.5,98 C187,97 185.5,95.5 184.5,93.5 C183.5,92 183.5,90 184,88 C184.5,85.5 186,83.5 187.5,81.5 C189,80 190.5,78.5 192,77.5 C192.5,77 193,76.5 194,76z" id="Mali"/>
      <path d="M370.5,123 C370,123.5 369,125 368,126.5 C366.5,128.5 365,131 364.5,133.5 C364,136 364,138.5 365,140.5 C366,143 367.5,145 369.5,146 C371,146.5 373,146.5 375,145.5 C377,144.5 378.5,143 380,141 C381,139.5 382,137.5 382,135.5 C382,133.5 381.5,131.5 380.5,130 C379,128 377,126.5 375,125 C374,124 372.5,123.5 370.5,123z" id="Sierra Leone"/>
      <path d="M260.5,338 C261,337 262,336 263.5,336 C265,336 266.5,336.5 267.5,338 C268.5,339 269,340.5 268.5,342 C268,343.5 267,344.5 265,345 C264,345 263,344.5 262,343.5 C261,342.5 260.5,341 260.5,339.5 C260.5,339 260.5,338.5 260.5,338z" id="Togo"/>
      <path d="M263,80 C264.5,80.5 265,82 265,83.5 C264.5,85.5 264,87 263,88 C262.5,88.5 261,89 260,88.5 C259,88 258,87 258,85.5 C258,84 259,82.5 260.5,81.5 C261.5,81 262,80.5 263,80z" id="Egypt"/>
      <path d="M370.5,148 C371,147.5 372.5,147.5 374,148 C375.5,148.5 376.5,149.5 377.5,151 C378,152 378,153.5 377,155 C376,156 374.5,156.5 373,156.5 C372,156.5 370.5,155.5 369.5,154.5 C368.5,153.5 368.5,152 368.5,150.5 C369,149.5 370,148.5 370.5,148z" id="Liberia"/>
      <path d="M327,294 C328.5,294.5 329,296 329,297.5 C329,299.5 328,301 326.5,302 C325.5,302.5 324,302.5 323,302 C321.5,301 321,299.5 321,298 C321.5,296.5 322.5,295 324,294.5 C325,294 326,294 327,294z" id="Gabon"/>
      <path d="M432.5,604 C434,604.5 435,606 435,608 C434.5,610 433.5,611.5 432,612 C431,612.5 429.5,612 428,611 C427,610 426.5,608.5 427,607 C427.5,605.5 429,604.5 430.5,604 C431.5,604 432,604 432.5,604z" id="Zimbabwe"/>
      <path d="M410.5,584 C411.5,583.5 413,583.5 414,584.5 C415.5,585.5 416,587 416,588.5 C415.5,590.5 414.5,592 412.5,593 C411.5,593.5 410,593 408.5,592 C407.5,591 407,589.5 407,588 C407.5,586.5 408.5,585 410,584.5 C410,584 410,584 410.5,584z" id="Zambia"/>
      <path d="M371,280 C372.5,280.5 373,282 373,283.5 C372.5,285.5 372,287 371,288 C370.5,288.5 369,289 368,288.5 C367,288 366,287 366,285.5 C366,284 367,282.5 368.5,281.5 C369.5,281 370,280.5 371,280z" id="Nigeria"/>
      <path d="M312,282 C313,282 314.5,282.5 315.5,283.5 C317,284.5 318,286 318,287.5 C318,289.5 317,291.5 315,293 C314,294 312,294.5 310.5,294 C309.5,293.5 308.5,292.5 308,291 C307.5,289.5 308,287.5 309.5,286 C310.5,285 311,284 311,283 C311,283 311.5,282.5 312,282z" id="Cameroon"/>
      <path d="M386,432 C387.5,432.5 388,434 388,435.5 C387.5,437.5 387,439 386,440 C385.5,440.5 384,441 383,440.5 C382,440 381,439 381,437.5 C381,436 382,434.5 383.5,433.5 C384.5,433 385,432.5 386,432z" id="Angola"/>
      <path d="M433.5,483 C435,483.5 435.5,485 435.5,486.5 C435,488.5 434.5,490 433.5,491 C433,491.5 431.5,492 430.5,491.5 C429.5,491 428.5,490 428.5,488.5 C428.5,487 429.5,485.5 431,484.5 C432,484 432.5,483.5 433.5,483z" id="DRC"/>
      <path d="M371,327 C372.5,327.5 373,329 373,330.5 C372.5,332.5 372,334 371,335 C370.5,335.5 369,336 368,335.5 C367,335 366,334 366,332.5 C366,331 367,329.5 368.5,328.5 C369.5,328 370,327.5 371,327z" id="CAR"/>
      <path d="M298,321 C299.5,321.5 300,323 300,324.5 C299.5,326.5 299,328 298,329 C297.5,329.5 296,330 295,329.5 C294,329 293,328 293,326.5 C293,325 294,323.5 295.5,322.5 C296.5,322 297,321.5 298,321z" id="Chad"/>
      <path d="M327,159 C328.5,159.5 329,161 329,162.5 C328.5,164.5 328,166 327,167 C326.5,167.5 325,168 324,167.5 C323,167 322,166 322,164.5 C322,163 323,161.5 324.5,160.5 C325.5,160 326,159.5 327,159z" id="Niger"/>
      <path d="M266.5,123 C268,123.5 268.5,125 268.5,126.5 C268,128.5 267.5,130 266.5,131 C266,131.5 264.5,132 263.5,131.5 C262.5,131 261.5,130 261.5,128.5 C261.5,127 262.5,125.5 264,124.5 C265,124 265.5,123.5 266.5,123z" id="Sudan"/>
      <path d="M312,207 C313.5,207.5 314,209 314,210.5 C313.5,212.5 313,214 312,215 C311.5,215.5 310,216 309,215.5 C308,215 307,214 307,212.5 C307,211 308,209.5 309.5,208.5 C310.5,208 311,207.5 312,207z" id="South Sudan"/>
      <path d="M344,220 C345.5,220.5 346,222 346,223.5 C345.5,225.5 345,227 344,228 C343.5,228.5 342,229 341,228.5 C340,228 339,227 339,225.5 C339,224 340,222.5 341.5,221.5 C342.5,221 343,220.5 344,220z" id="Ethiopia"/>
      <path d="M327,227 C328.5,227.5 329,229 329,230.5 C328.5,232.5 328,234 327,235 C326.5,235.5 325,236 324,235.5 C323,235 322,234 322,232.5 C322,231 323,229.5 324.5,228.5 C325.5,228 326,227.5 327,227z" id="Somalia"/>
      <path d="M473,506 C474.5,506.5 475,508 475,509.5 C474.5,511.5 474,513 473,514 C472.5,514.5 471,515 470,514.5 C469,514 468,513 468,511.5 C468,510 469,508.5 470.5,507.5 C471.5,507 472,506.5 473,506z" id="Mozambique"/>
      <path d="M488,655 C490,655.5 491,657 491,659 C490.5,661 489.5,662.5 488,663 C487,663.5 485.5,663 484,662 C483,661 482.5,659.5 483,658 C483.5,656.5 485,655.5 486.5,655 C487.5,655 488,655 488,655z" id="South Africa"/>
      <path d="M433.5,630 C435,630.5 435.5,632 435.5,633.5 C435,635.5 434.5,637 433.5,638 C433,638.5 431.5,639 430.5,638.5 C429.5,638 428.5,637 428.5,635.5 C428.5,634 429.5,632.5 431,631.5 C432,631 432.5,630.5 433.5,630z" id="Botswana"/>
      <path d="M428,582 C429.5,582.5 430,584 430,585.5 C429.5,587.5 429,589 428,590 C427.5,590.5 426,591 425,590.5 C424,590 423,589 423,587.5 C423,586 424,584.5 425.5,583.5 C426.5,583 427,582.5 428,582z" id="Namibia"/>
      <path d="M464.5,417 C466,417.5 466.5,419 466.5,420.5 C466,422.5 465.5,424 464.5,425 C464,425.5 462.5,426 461.5,425.5 C460.5,425 459.5,424 459.5,422.5 C459.5,421 460.5,419.5 462,418.5 C463,418 463.5,417.5 464.5,417z" id="Madagascar"/>
      <path d="M370.5,178 C372,178.5 372.5,180 372.5,181.5 C372,183.5 371.5,185 370.5,186 C370,186.5 368.5,187 367.5,186.5 C366.5,186 365.5,185 365.5,183.5 C365.5,182 366.5,180.5 368,179.5 C369,179 369.5,178.5 370.5,178z" id="Ivory Coast"/>
      <path d="M352,217 C353.5,217.5 354,219 354,220.5 C353.5,222.5 353,224 352,225 C351.5,225.5 350,226 349,225.5 C348,225 347,224 347,222.5 C347,221 348,219.5 349.5,218.5 C350.5,218 351,217.5 352,217z" id="Ghana"/>
      <path d="M369,103.5 C370,103 371.5,103 372.5,104 C373,105 373,106.5 372,107.5 C371,108.5 369.5,109 368,108.5 C367,108 366.5,107 366.5,106 C366.5,105 367.5,104 368.5,103.5 C368.5,103.5 369,103.5 369,103.5z" id="Gambia"/>
      <path d="M371,113 C372,112.5 373.5,112.5 375,113 C376.5,113.5 376,114.5 374,115.5 C372,117 370.5,117.5 369,118 C368.5,117 368,116 368.5,115 C369.5,114 370.5,113.5 371,113z" id="Guinea-Bissau"/>
    </g>
    <g fill="hsl(var(--primary))" stroke="hsl(var(--primary-foreground))" strokeWidth="0.5" filter="url(#glow)">
        {/* Highlighted East African countries */}
        <path d="M352,246 C353,246.5 354,247.5 354,249 C353.5,250.5 353,252 352,253 C351.5,253.5 350,254 349,253.5 C348,253 347,252 347,250.5 C347,249 348,247.5 349.5,246.5 C350.5,246 351,245.5 352,246z" id="Kenya" />
        <path d="M371,257 C372.5,257.5 373,259 373,260.5 C372.5,262.5 372,264 371,265 C370.5,265.5 369,266 368,265.5 C367,265 366,264 366,262.5 C366,261 367,259.5 368.5,258.5 C369.5,258 370,257.5 371,257z" id="Tanzania" />
        <path d="M344,248 C345.5,248.5 346,250 346,251.5 C345.5,253.5 345,255 344,256 C343.5,256.5 342,257 341,256.5 C340,256 339,255 339,253.5 C339,252 340,250.5 341.5,249.5 C342.5,249 343,248.5 344,248z" id="Uganda" />
        <path d="M336.5,248 C337,247 338,246.5 339,246 C340.5,246 341.5,246.5 342,247.5 C342.5,248.5 342.5,250 342,251 C341,252.5 339.5,253.5 338,254 C337,254.5 336,254 335,253 C334,252 334.5,250.5 335.5,249.5 C336,249 336,248.5 336.5,248z" id="Rwanda" />
    </g>
  </svg>
);


export default function Footer() {
  return (
    <footer className="border-t border-slate-700 bg-slate-900 text-slate-200 shadow-inner">
      <div className="container mx-auto max-w-screen-2xl px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">

          {/* Column 1: Logo, Location, Social, & Payments */}
          <div className="space-y-6">
            <div>
              <Logo className="text-3xl" />
              <p className="mt-4 text-sm text-slate-400 leading-relaxed">
                All you want, all in one place. Shop smarter with {SITE_NAME} — Kenya's most trusted online marketplace.
              </p>
            </div>
            <div>
              <h3 className="text-base font-semibold text-slate-100 tracking-wider uppercase mb-3 flex items-center">
                <MapPin className="w-5 h-5 mr-2 text-primary" /> Our Location
              </h3>
              <address className="text-sm text-slate-400 not-italic">
                Taveta Rd, Nairobi, Kenya.
              </address>
            </div>
            <div>
              <h3 className="text-base font-semibold text-slate-100 tracking-wider uppercase mb-4">Connect With Us</h3>
              <div className="flex space-x-5">
                {[
                  { href: "https://facebook.com/cremecollections", label: "Facebook", icon: Facebook },
                  { href: "https://instagram.com/cremecollections", label: "Instagram", icon: Instagram },
                  { href: "https://x.com/cremecollections", label: "X", icon: XIcon },
                ].map(social => (
                  <a href={social.href} target="_blank" rel="noopener noreferrer" aria-label={social.label} key={social.label} className="text-slate-400 hover:text-primary transition-transform duration-200 hover:scale-110">
                    <social.icon className="w-6 h-6" />
                  </a>
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-base font-semibold text-slate-100 tracking-wider uppercase mb-4">We Accept</h3>
              <div className="flex flex-wrap items-center gap-2">
                <MpesaIcon />
                <MastercardIcon />
                <div className="flex items-center justify-center h-8 px-2 bg-gray-200 rounded text-gray-700" title="Direct Bank Transfer">
                  <Landmark className="h-5 w-5" />
                </div>
              </div>
            </div>
          </div>

          {/* Column 2 & 3: Links (Combined for better flow on some screens) */}
          <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-8">
            <div>
              <h3 className="text-base font-semibold text-slate-100 tracking-wider uppercase mb-4">Shop</h3>
              <ul role="list" className="space-y-2.5">
                <li><Link href="/products" className="text-sm text-slate-300 hover:text-primary transition-colors hover:underline">All Products</Link></li>
                <li><Link href="/#promotions-slider" className="text-sm text-slate-300 hover:text-primary transition-colors hover:underline">Promotions</Link></li>
                <li><Link href="/#weekly-deals" className="text-sm text-slate-300 hover:text-primary transition-colors hover:underline">Flash Deals</Link></li>
                 <li><Link href="/products?filter=new" className="text-sm text-slate-300 hover:text-primary transition-colors hover:underline">New Arrivals</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-base font-semibold text-slate-100 tracking-wider uppercase mb-4">Company & Legal</h3>
              <ul role="list" className="space-y-2.5">
                {FOOTER_COMPANY_LINKS.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-slate-300 hover:text-primary transition-colors hover:underline flex items-center"
                    >
                      {link.icon && <link.icon className="inline h-4 w-4 mr-2 text-primary/70" />}
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
             <div>
              <h3 className="text-base font-semibold text-slate-100 tracking-wider uppercase mb-4">Support</h3>
              <ul role="list" className="space-y-2.5">
                {FOOTER_SUPPORT_LINKS.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-slate-300 hover:text-primary transition-colors hover:underline flex items-center"
                    >
                      {link.icon && <link.icon className="inline h-4 w-4 mr-2 text-primary/70" />}
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-base font-semibold text-slate-100 tracking-wider uppercase mb-4">Contact Info</h3>
              <div className="space-y-3">
                  <div className="flex items-start text-sm text-slate-300">
                    <Mail className="w-4 h-4 mr-2.5 text-primary shrink-0 mt-0.5" />
                    <div className="flex flex-col">
                        <a href="mailto:support@cremecollections.shop" className="hover:text-primary transition-colors hover:underline">support@cremecollections.shop</a>
                        <a href="mailto:creme.collectionlt@gmail.com" className="hover:text-primary transition-colors hover:underline">creme.collectionlt@gmail.com</a>
                    </div>
                  </div>
                  <div className="flex items-start text-sm text-slate-300">
                    <MessageSquare className="w-4 h-4 mr-2.5 text-primary shrink-0 mt-0.5" />
                    <div className="flex flex-col">
                        <a href="https://wa.me/254742468070" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors hover:underline">+254 742 468070</a>
                        <a href="https://wa.me/254743117211" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors hover:underline">+254 743 117211</a>
                        <a href="https://wa.me/254717988700" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors hover:underline">+254 717 988700</a>
                    </div>
                  </div>
                  <div className="flex items-start text-sm text-slate-300">
                      <Clock className="w-4 h-4 mr-2.5 text-primary shrink-0 mt-0.5" />
                      <div>
                          <span>Mon – Fri: 9am – 5pm EAT</span><br/>
                          <span>Saturday: 9am – 12pm EAT</span><br/>
                          <span className="text-slate-400">Sun & Holidays: Closed</span>
                      </div>
                  </div>
              </div>
          </div>
          </div>


          {/* Column 4: Map */}
          <div className="lg:col-span-1">
             <h3 className="text-base font-semibold text-slate-100 tracking-wider uppercase mb-4 flex items-center">
                <Globe className="w-5 h-5 mr-2 text-primary" /> Our Reach
             </h3>
            <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-lg shadow-md border border-slate-700 bg-slate-800/50 p-2">
              <AfricaMap />
            </div>
            <p className="text-xs text-center text-slate-400 mt-2">Serving Kenya, Tanzania, Uganda, and Rwanda.</p>
          </div>

        </div>
        <div className="mt-12 border-t border-slate-700 pt-8 text-center">
          <p className="text-sm text-slate-400">
            &copy; {new Date().getFullYear()} {SITE_NAME}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
