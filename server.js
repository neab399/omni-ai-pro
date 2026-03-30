const fetchRealResponse = async () => {
        try {
          // 1. Backend port 5000 ho gaya hai
          const response = await fetch('http://localhost:5000/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              messages: [{ role: 'user', content: text.trim() }], // Ab backend array expect kar raha hai
              providerId: model.providerId, 
              modelId: model.id,
              systemPrompt: settings.systemPrompt             
            })
          });

          if (!response.ok) throw new Error("Server connection failed");

          // 2. 🚀 MAGIC: Streaming Response Reader
          const reader = response.body.getReader();
          const decoder = new TextDecoder('utf-8');
          let replyText = '';

          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            // Chunks ko decode karo
            const chunk = decoder.decode(value, { stream: true });
            const lines = chunk.split('\n\n');

            for (const line of lines) {
              if (line.startsWith('data: ')) {
                const dataStr = line.replace('data: ', '');
                try {
                  const parsed = JSON.parse(dataStr);
                  
                  if (parsed.type === 'error') {
                    throw new Error(parsed.message);
                  }
                  
                  if (parsed.type === 'chunk') {
                    replyText += parsed.text;

                    // UI ko word-by-word update karo!
                    setChatHistories(prev => {
                      const updated = { ...prev };
                      const msgs = [...(updated[activeConvId]?.[key] || [])];
                      const streamIdx = msgs.findLastIndex(m => m.isStreaming);
                      
                      if (streamIdx !== -1) {
                        msgs[streamIdx] = {
                          ...msgs[streamIdx],
                          content: replyText,
                          tokenCount: estimateTokens(replyText)
                        };
                      }
                      updated[activeConvId] = { ...(updated[activeConvId] || {}), [key]: msgs };
                      return updated;
                    });
                  }
                } catch (e) {
                  // Ignore JSON parse errors for incomplete chunks
                }
              }
            }
          }

          // 3. Stream khatam hone ke baad isStreaming false karo aur DB me save karo
          setChatHistories(prev => {
            const updated = { ...prev };
            const msgs = [...(updated[activeConvId]?.[key] || [])];
            const streamIdx = msgs.findLastIndex(m => m.isStreaming);
            if (streamIdx !== -1) {
              msgs[streamIdx] = { ...msgs[streamIdx], isStreaming: false };
            }
            updated[activeConvId] = { ...(updated[activeConvId] || {}), [key]: msgs };

            // Save to Database
            setConversations(convs => {
              const currentConv = convs.find(c => c.id === activeConvId);
              saveChatToDB(activeConvId, finalTitle || currentConv?.title, updated[activeConvId], currentConv?.pinned, currentConv?.createdAt);
              return convs;
            });

            return updated;
          });

        } catch (error) {
          console.error("API Error:", error);
          
          setChatHistories(prev => {
            const updated = { ...prev };
            const msgs = [...(updated[activeConvId]?.[key] || [])];
            const streamIdx = msgs.findLastIndex(m => m.isStreaming);
            if (streamIdx !== -1) {
              msgs[streamIdx] = {
                ...msgs[streamIdx],
                content: `❌ **Backend Error:** ${error.message}`,
                isStreaming: false,
                model
              };
            }
            updated[activeConvId] = { ...(updated[activeConvId] || {}), [key]: msgs };
            return updated;
          });
        }
      };