"use client";

import { useState, useRef, useEffect } from 'react';
import Dashboard from '@/components/DashboardFinanceiro/page';
import Contas from '@/components/Contas/page';
import Salarios from '@/components/Salarios/page';
import Transacoes from '@/components/Transacoes/page';

export default function Financeiro() {
  const [activeIndex, setActiveIndex] = useState(0);
  const containerRef = useRef(null);
  const [underlineStyle, setUnderlineStyle] = useState({ left: 0, width: 0 });

  const items = ['Dashboard', 'Salários', 'Contas', 'Transações'];

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const activeItem = container.children[activeIndex];
    if (activeItem) {
      setUnderlineStyle({
        left: activeItem.offsetLeft,
        width: activeItem.offsetWidth,
      });
    }
  }, [activeIndex]);

 const contentMap = {
  0: <Dashboard/>,
  1: <Salarios/>,
  2: <Contas/>,
  3: <Transacoes/>
}

  return (
    <>
      <style>{`
        .underline {
          position: absolute;
          bottom: 0;
          height: 2px;
          background-color: #2c3e3e;
          transition: left 0.3s ease, width 0.3s ease;
        }
      `}</style>

      <div
        ref={containerRef}
        className="flex items-center justify-start mt-4 gap-2 overflow-x-auto whitespace-nowrap relative border-b-2 border-gray-300"
        style={{ paddingBottom: '5px' }}
      >
        {items.map((item, index) => (
          <div
            key={index}
            className="cursor-pointer px-4 py-2 text-sm text-[#4a6464] whitespace-nowrap"
            onClick={() => setActiveIndex(index)}
            style={{
              fontWeight: activeIndex === index ? '600' : '400',
              color: activeIndex === index ? '#2c3e3e' : '#4a6464',
            }}
          >
            {item}
          </div>
        ))}

        <div
          className="underline"
          style={{ left: underlineStyle.left, width: underlineStyle.width }}
        />
      </div>

      <div className="mt-6">
        {contentMap[activeIndex]}
      </div>
    </>
  );
}
